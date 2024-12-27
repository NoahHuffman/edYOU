import { CANVAS_KEY, USER_ID } from "@/api/constants";
import { Assignment } from "@/api/interfaces";

const accessToken = CANVAS_KEY;
const baseUrl = 'http://192.168.1.10:3000/';
// const coursesUrl = `https://utchattanooga.instructure.com/api/v1/planner/items?start_date=2024-12-04T05%3A00%3A00.000Z&order=asc`;
// const canvasUrl = `https://utchattanooga.instructure.com/api/v1/users/${USER_ID}/planner/items`;
const coursesUrl = baseUrl + 'getCourses';
const assignmentsUrl = baseUrl + 'getAssignments';
// const assignmentsUrl =
//   `https://utchattanooga.instructure.com/api/v1/users/${USER_ID}/courses/36686/assignments`;

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
    console.log(data);
    return data;
  } catch (error: any) {
    console.error("Errors:", error.message);
    throw error;
  }
};

// export const fetchCourses = async () => {
//   try {
//     const response = await fetch(coursesUrl, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const data: any = await response.json();
//     return data;
//   } catch (error: any) {
//     console.error("Errors:", error.message);
//     throw error;
//   }
// };

export const fetchAssignments = async (courses: { [key: string]: number }) => {
  const assignmentsPromises = Object.entries(courses).map(
    async ([courseName, id]) => {
      // const assignmentsUrl = `https://utchattanooga.instructure.com/api/v1/users/${USER_ID}/courses/${id}/assignments`;
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

        console.log(response);

        if (!response.ok) {
          throw new Error("Error fetching assignments");
        }

        const data: Assignment[] = await response.json();
        return { courseName, assignments: data };
      } catch (error: any) {
        console.error("Error:", error.message);
        throw error;
      }
    }
  );

  return Promise.all(assignmentsPromises);
};
