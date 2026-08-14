from fastapi import FastAPI, HTTPException
from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv("/public/Attendance management system/ai-backend/.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Supabase configuration is missing")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

app = FastAPI(
    title="Attendance AI Backend",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "status": "online",
        "message": "Attendance AI Backend is running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

@app.get("/students")
def get_students():
    try:
        result = (
            supabase
            .table("students")
            .select("id,name,schoolName,class_name,gender,birthDate,admissionDate,created_at")
            .execute()
        )

        return {
            "status": "success",
            "count": len(result.data or []),
            "students": result.data or []
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Unable to load students"
        )


@app.get("/attendance")
def get_attendance():
    try:
        result = (
            supabase
            .table("attendance")
            .select(
                "id,student_id,student_name,class_name,"
                "teacher_id,teacher_username,attendance_date,"
                "status,created_at"
            )
            .order("attendance_date", desc=True)
            .execute()
        )

        return {
            "status": "success",
            "count": len(result.data or []),
            "attendance": result.data or []
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to load attendance"
        )


@app.get("/ai-analysis")
def ai_attendance_analysis():
    try:
        result = (
            supabase
            .table("attendance")
            .select(
                "student_id,student_name,class_name,"
                "attendance_date,status"
            )
            .execute()
        )

        records = result.data or []

        if not records:
            return {
                "status": "success",
                "message": "No attendance records available",
                "analysis": []
            }

        students = {}

        for record in records:
            student_id = record.get("student_id")

            if student_id not in students:
                students[student_id] = {
                    "student_id": student_id,
                    "student_name": record.get("student_name", ""),
                    "class_name": record.get("class_name", ""),
                    "present": 0,
                    "absent": 0
                }

            status = str(
                record.get("status", "")
            ).lower()

            if status == "present":
                students[student_id]["present"] += 1
            elif status == "absent":
                students[student_id]["absent"] += 1

        analysis = []

        for student in students.values():
            total = (
                student["present"] +
                student["absent"]
            )

            percentage = (
                student["present"] / total * 100
                if total else 0
            )

            if percentage < 75:
                risk = "HIGH"
                message = "Attendance needs immediate attention."
            elif percentage < 85:
                risk = "MEDIUM"
                message = "Attendance should be monitored."
            else:
                risk = "LOW"
                message = "Attendance looks healthy."

            analysis.append({
                **student,
                "total_days": total,
                "attendance_percentage": round(
                    percentage, 2
                ),
                "risk": risk,
                "message": message
            })

        return {
            "status": "success",
            "count": len(analysis),
            "analysis": analysis
        }

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Unable to analyse attendance"
        )
