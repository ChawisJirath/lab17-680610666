import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import type { Course } from "@/lib/types";

const semesterLabels: Record<NonNullable<Course["semester"]>, string> = {
  "1": "ภาคการศึกษาที่ 1",
  "2": "ภาคการศึกษาที่ 2",
  summer: "ภาคฤดูร้อน",
};

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  return (
    <div className="rounded-lg border">
      <Table className="min-w-[1100px] table-fixed text-sm">
        <colgroup>
          <col className="w-[5%]" />
          <col className="w-[34%]" />
          <col className="w-[5%]" />
          <col className="w-[10%]" />
          <col className="w-[18%]" />
          <col className="w-[13%]" />
          <col className="w-[10%]" />
          <col className="w-[5%]" />
        </colgroup>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead className="text-center">หลักสูตร</TableHead>
            <TableHead className="text-center">ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead className="text-center">รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-16 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell className="font-medium">{course.courseId}</TableCell>
              <TableCell className="font-medium">
                {course.courseTitle}
              </TableCell>
              <TableCell className="text-center">
                {course.program ? (
                  <Badge variant="outline">{course.program}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {course.semester ? (
                  semesterLabels[course.semester]
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="whitespace-normal text-muted-foreground">
                {course.description || (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="whitespace-normal">
                {course.instructors.length === 0 ? (
                  <span className="text-muted-foreground">ยังไม่มีผู้สอน</span>
                ) : (
                  <div className="space-y-[1px]">
                    {course.instructors.map((instructor, index) => {
                      return (
                        <div key={`${instructor.email}-${index}`}>
                          <div>{instructor.name}</div>
                          <div className="text-xs leading-tight text-muted-foreground">
                            {instructor.email}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="secondary"
                  className={
                    course.notifyByEmail
                      ? "h-5 bg-foreground text-background hover:bg-foreground/90"
                      : "h-5"
                  }
                >
                  {course.notifyByEmail ? "รับ" : "ไม่รับ"}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
