import axios, { AxiosError } from "axios";
import type { DayName, UserProgress, WeekDay } from "../types";
import { useEffect, useState } from "react";
import type {
  Plan,
  PlanWeek,
  User,
  UserPlan,
  UserProfile,
} from "@prisma/client";
import { useNavigate } from "react-router-dom";

export const useUserDashboard = () => {
  const [currentPlan, setCurrentPlan] = useState<
    (UserPlan & { plan: Plan } & { progress?: UserProgress }) | null
  >(null);
  const [userProfile, setUserProfile] = useState<
    (Pick<User, "fullName" | "email"> & { userProfile: UserProfile }) | null
  >(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [plan, setPlan] = useState<
    | (Plan & {
        createdBy: Pick<User, "fullName">;
        weeks: (Pick<PlanWeek, "id" | "weekNumber"> & { days: WeekDay[] })[];
      })
    | null
  >(null);
  const [currentWeekDay, setCurrentWeekDay] = useState<WeekDay | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!plan || !currentPlan?.startDate) return;

    const startDate = new Date(currentPlan.startDate);
    const today = new Date();

    // Calculate number of days since plan started
    const diffDays = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    // Each week = 7 days
    const weekNumber = Math.floor(diffDays / 7);
    const dayNumber = diffDays % 7;
    if (weekNumber < 0 || dayNumber < 0) {
      return;
    }

    // Ensure we don't go out of bounds
    const safeWeekIndex = Math.min(weekNumber, plan.weeks.length - 1);
    if (safeWeekIndex < 0) {
      return;
    }

    const safeDayIndex = Math.min(
      dayNumber,
      plan.weeks[safeWeekIndex].days.length - 1
    );
    if (safeDayIndex < 0) {
      return;
    }

    const todayPlan = plan.weeks[safeWeekIndex].days[safeDayIndex];
    setCurrentWeekDay(todayPlan);
  }, [plan, currentPlan, setCurrentWeekDay]);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        if (!currentPlan?.planId) {
          // navigate("/");
          console.log(currentPlan?.planId);
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/api/workout-plans/${currentPlan.planId}`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          const planData = res.data.data as Plan & {
            createdBy: Pick<User, "fullName">;
            weeks: PlanWeek[];
          };

          // Transform weeks with days structure
          const planWeeks = planData.weeks.map((week: PlanWeek) => {
            const activities = (week.activities || {}) as WeekDay[];

            return {
              ...week,
              days: (
                [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ] as DayName[]
              ).map((day) => {
                const activityDay = activities.find((d) => d.day === day);

                return {
                  day,
                  workoutName: activityDay?.workoutName || "",
                  exercises: activityDay?.exercises || [],
                };
              }),
            };
          });

          const fullPlan = {
            ...planData,
            weeks: planWeeks,
          };

          setPlan(fullPlan);
        }
      } catch (err) {
        console.log(err);
        if (err instanceof AxiosError) {
          console.error(err.response?.data || err.message);
          navigate("/dashboard");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [navigate, currentPlan]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/user-profile", {
          withCredentials: true,
        });
        setUserProfile(res.data.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(true);
        }
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/user-profile/user-plan",
          {
            withCredentials: true,
          }
        );

        if (res.data.data.userPlans) {
          setCurrentPlan(res.data.data.userPlans);
          return;
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserPlan();
  }, []);

  {
    return {
      error,
      plan,
      userProfile,
      currentPlan,
      loading,
      currentWeekDay,
    };
  }
};
