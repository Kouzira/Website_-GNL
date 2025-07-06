// src/components/Exam.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  Radio,
  FormControlLabel,
  Button,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchExamQuestions, saveExamResult } from "../../api/exam";

const TOTAL_TIME = 150 * 60; // 150 phút
const QUESTIONS_PER_ROW = 15;

export default function Exam() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [scoreMessage, setScoreMessage] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [blockNav, setBlockNav] = useState(true);

  const flatQuestions = useMemo(() => {
    const arr = [];
    questions.forEach((q) => {
      if (q.type === "single") {
        arr.push({ ...q, type: "single" });
      } else if (q.type === "group") {
        q.groupQuestions.forEach((subQ) => {
          arr.push({
            ...subQ,
            type: "group-sub",
            parentId: q._id,
            parentContent: q.content,
          });
        });
      }
    });
    return arr;
  }, [questions]);

  useEffect(() => {
    setLoading(true);
    fetchExamQuestions()
      .then((res) => {
        setQuestions(res.data.questions);
        setLoading(false);
      })
      .catch((err) => {
        setSnackbarMessage(err.response?.data?.error || "Lấy câu hỏi thất bại");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        navigate("/");
      });
  }, [navigate]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (blockNav) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [blockNav]);

  if (loading || flatQuestions.length === 0) {
    return (
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <Typography>Đang tải câu hỏi...</Typography>
      </Box>
    );
  }

  const currentFlatQuestion = flatQuestions[currentIndex];
  if (!currentFlatQuestion) return null;

  const parentContent =
    currentFlatQuestion.type === "group-sub"
      ? currentFlatQuestion.parentContent
      : null;

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentFlatQuestion._id]: value,
    }));
  };

  const handleNext = () => {
    if (currentIndex < flatQuestions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const calculateScore = () => {
    let correctCount = 0;
    flatQuestions.forEach((q) => {
      const ans = answers[q._id];
      if (ans && ans === q.correctAnswer) correctCount++;
    });
    const score = correctCount * 10;
    return { score, correctCount };
  };

  const handleSubmit = () => {
    setSubmitDialogOpen(true);
  };

  const confirmSubmit = () => {
    clearInterval(timerRef.current);

    const { score, correctCount } = calculateScore();

    const totalQuestionsCount = flatQuestions.length;

    const resultData = {
      score,
      totalQuestions: totalQuestionsCount,
      correctCount,
      timeTaken: TOTAL_TIME - timeLeft,
    };

    saveExamResult(resultData)
      .then(() => {
        setScoreMessage(`Kết thúc thi! Điểm của bạn: ${score} / ${totalQuestionsCount * 10}`);
        setScoreDialogOpen(true);
      })
      .catch(() => {
        setSnackbarMessage("Lưu kết quả thất bại.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });

    setSubmitDialogOpen(false);
    // Sau khi nộp bài, tắt chặn chuyển trang
    // để user có thể rời trang thoải mái
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  function SingleQuestion({ question, answer, onAnswerChange }) {
    return (
      <>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {question.content}
        </Typography>
        <RadioGroup value={answer || ""} onChange={(e) => onAnswerChange(e.target.value)}>
          {question.options.map((option, idx) => (
            <FormControlLabel key={idx} value={option} control={<Radio />} label={option} />
          ))}
        </RadioGroup>
      </>
    );
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleLeave = () => {
    setBlockNav(false);
    setShowLeaveDialog(false);
  };
  const handleStay = () => {
    setShowLeaveDialog(false);
  };

  return (
    <>
      {/* Leave Exam Warning Dialog */}
      <Dialog open={showLeaveDialog}>
        <DialogTitle>Cảnh báo</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn rời khỏi trang này? Nếu bạn rời đi, bài thi sẽ không được lưu!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStay} color="primary">Ở lại</Button>
          <Button onClick={handleLeave} color="error">Rời đi</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ maxWidth: 10000, mx: "auto", mt: 4, px: 2, display: "flex", gap: 3 }}>
        <Box
          sx={{
            width: 480,
            display: "grid",
            gridTemplateColumns: `repeat(${QUESTIONS_PER_ROW}, 1fr)`,
            gap: 1,
            userSelect: "none",
          }}
        >
          {flatQuestions.map((q, idx) => {
            const answered = !!answers[q._id];
            return (
              <Box
                key={q._id}
                onClick={() => setCurrentIndex(idx)}
                sx={{
                  cursor: "pointer",
                  border: currentIndex === idx ? "2px solid #4caf50" : "1px solid #ccc",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  height: 45,
                  backgroundColor: currentIndex === idx ? "#e8f5e9" : "transparent",
                  "&:hover": { backgroundColor: "#f1f8e9" },
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    borderBottom: "1px solid #ccc",
                    backgroundColor: currentIndex === idx ? "#4caf50" : "#fafafa",
                    color: currentIndex === idx ? "white" : "black",
                    fontSize: 13,
                  }}
                >
                  {idx + 1}
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: answered ? "#a5d6a7" : "white",
                    transition: "background-color 0.3s",
                  }}
                />
              </Box>
            );
          })}
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" gutterBottom>
            Câu hỏi {currentIndex + 1} / {flatQuestions.length}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Thời gian còn lại: {formatTime(timeLeft)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={((TOTAL_TIME - timeLeft) / TOTAL_TIME) * 100}
            sx={{ mb: 2 }}
          />

          <Paper variant="outlined" sx={{ p: 3 }}>
            {currentFlatQuestion.type === "single" ? (
              <SingleQuestion
                question={currentFlatQuestion}
                answer={answers[currentFlatQuestion._id]}
                onAnswerChange={handleAnswerChange}
              />
            ) : (
              <>
                <Typography variant="subtitle1" sx={{ mb: 2, fontStyle: "italic", color: "#555" }}>
                  {parentContent}
                </Typography>
                <SingleQuestion
                  question={currentFlatQuestion}
                  answer={answers[currentFlatQuestion._id]}
                  onAnswerChange={handleAnswerChange}
                />
              </>
            )}
          </Paper>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" disabled={currentIndex === 0} onClick={handlePrev}>
              Câu trước
            </Button>
            <Button
              variant="contained"
              disabled={currentIndex === flatQuestions.length - 1}
              onClick={handleNext}
            >
              Câu tiếp
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button variant="contained" color="error" onClick={handleSubmit}>
              Nộp bài
            </Button>
          </Box>

          {/* Dialog xác nhận nộp bài */}
          <Dialog open={submitDialogOpen} onClose={() => setSubmitDialogOpen(false)}>
            <DialogTitle>Xác nhận nộp bài</DialogTitle>
            <DialogContent>Bạn chắc chắn muốn nộp bài thi không?</DialogContent>
            <DialogActions>
              <Button onClick={() => setSubmitDialogOpen(false)}>Hủy</Button>
              <Button onClick={confirmSubmit} variant="contained" color="error">
                Nộp bài
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog hiển thị điểm thi */}
          <Dialog open={scoreDialogOpen} onClose={() => setScoreDialogOpen(false)}>
            <DialogTitle>Kết quả thi</DialogTitle>
            <DialogContent>
              <Typography>{scoreMessage}</Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setScoreDialogOpen(false);
                  navigate("/result");
                }}
                variant="contained"
                color="primary"
              >
                Xem chi tiết
              </Button>
              <Button
                onClick={() => {
                  setScoreDialogOpen(false);
                  navigate("/main");
                }}
                variant="contained"
                color="error"
              >
                Hủy
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar thông báo lỗi */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: 300 }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </>
  );
}
