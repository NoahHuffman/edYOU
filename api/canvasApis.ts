import { CANVAS_KEY, USER_ID } from "@/api/constants";
import { Assignment } from "@/api/interfaces";

const accessToken = CANVAS_KEY;
const baseUrl = "http://192.168.1.10:3000/";
// const baseUrl = "http://10.168.21.50:3000/";
const coursesUrl = baseUrl + "getCourses";
const assignmentsUrl = baseUrl + "getAssignments";

export const fetchCourses = async () => {
  try {
    const response = await fetch(coursesUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const activeCourses = data.filter((course: any) => 
      course.enrollments.some((enrollment: any) => enrollment.enrollment_state === 'active')
    );

    return activeCourses;
  } catch (error: any) {
    console.error("Error fetching courses: ", error.message);
    throw error;
  }
};

export const fetchAssignments = async (courses: { [key: string]: number }) => {
  const assignmentsPromises = Object.entries(courses).map(
    async ([courseName, id]) => {
      try {
        const response = await fetch(assignmentsUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId: id,
            userId: USER_ID,
          }),
        });

        const data: Assignment[] = await response.json();
        return { courseName, assignments: data };
      } catch (error: any) {
        console.error("Error fetching assignments: ", error.message);
        throw error;
      }
    }
  );

  return Promise.all(assignmentsPromises);
};
