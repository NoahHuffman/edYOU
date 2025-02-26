import { fetchCourses, fetchAssignments } from "@/api/canvasApis";
import { Assignment, CourseAssignment, Items } from "@/api/interfaces";
import { UTC_COURSE_CODE_LENGTH, getClassName } from "@/api/constants";

export const loadCourses = async () => {
  const courses: { [key: string]: string } = {};
  const courseColorMap: { [key: string]: string } = {};
  const assignedColors = new Set<string>();
  const colorList = [
    "#F8D3B0",
    "#E1C6E7",
    "#B2E0D9",
    "#A4C8E1",
    "#F4B6A0",
    "#F9EBAE",
    "#F2C6D4",
    "#C8E1D4",
    "#A3D1E5",
    "#EDE1C2",
  ];

  const getColorForCourseId = (courseId: string): string => {
    const hash = Array.from(courseId).reduce(
      (acc, char) => acc + char.charCodeAt(0),
      0
    );
    const index = hash % colorList.length;
    const color = colorList[index];

    if (assignedColors.has(color)) {
      for (let i = 0; i < colorList.length; i++) {
        const nextColor = colorList[(index + i) % colorList.length];
        if (!assignedColors.has(nextColor)) {
          assignedColors.add(nextColor);
          return nextColor;
        }
      }
    } else {
      assignedColors.add(color);
      return color;
    }
    return "white";
  };

  const coursesData = await fetchCourses();
  for (let i = 0; i < coursesData.length; i++) {
    const course = coursesData[i];
    if (course && course.id && course.name) {
      const courseId = course.id;
      const fullCourseName = course.name;
      if (
        courseId &&
        fullCourseName &&
        courseId.toString().length === UTC_COURSE_CODE_LENGTH &&
        !Object.values(courses).includes(courseId)
      ) {
        const courseName = getClassName(course.name);
        courses[courseName] = courseId;
        courseColorMap[courseName] = getColorForCourseId(courseName);
      }
    } else {
      console.warn("Course data is missing:", course);
    }
  }

  return { courses, courseColorMap };
};

export const loadAssignments = async (
  courses: { [key: string]: string },
  currentDate: string
) => {
  const courseAssignments: CourseAssignment = {};
  const newItems: Items = {};

  const assignmentsData = await fetchAssignments(courses);
  for (let i = 0; i < assignmentsData.length; i++) {
    if (assignmentsData[i].assignments.length > 0) {
      for (let j = 0; j < assignmentsData[i].assignments.length; j++) {
        const courseName = assignmentsData[i].courseName;
        const assignment: Assignment = assignmentsData[i].assignments[j];
        const descriptionHtml = assignment.description;
        const html_url = assignment.html_url;

        if (!assignment.name) assignment.name = "Unnamed Assignment";
        if (!assignment.due_at) {
          assignment.due_at = currentDate;
          assignment.name += " (No due date)";
        } else {
          const date = new Date(assignment.due_at);
          date.setDate(date.getDate() - 1);
          assignment.due_at = date.toISOString();
        }
        if (!assignment.description) {
          assignment.description = "No description provided.";
        } else {
          assignment.description = descriptionHtml;
        }

        const assignmentEntry = {
          name: assignment.name,
          description: assignment.description,
          dueDate: assignment.due_at,
          html_url: html_url,
        };

        if (!courseAssignments[courseName]) {
          courseAssignments[courseName] = [];
        }
        courseAssignments[courseName].push(assignmentEntry);
      }
    }
  }

  for (const courseName in courseAssignments) {
    const assignments = courseAssignments[courseName];

    assignments.forEach((assignment) => {
      const dueDate = new Date(assignment.dueDate);
      const formattedDate = dueDate.toISOString().split("T")[0];

      if (!newItems[formattedDate]) {
        newItems[formattedDate] = [];
      }

      newItems[formattedDate].push({
        course_id: courseName,
        name: assignment.name,
        description: assignment.description,
        time: dueDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        html_url: assignment.html_url,
        due_at: assignment.dueDate,
      });
    });
  }

  return newItems;
};
