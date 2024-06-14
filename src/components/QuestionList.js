import React, { useEffect, useState } from "react";
import QuestionItem from "./QuestionItem";
function QuestionList() {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    fetchQuestions();
  }, []);
  const fetchQuestions = async () => {
    try {
      const response = await fetch("http://localhost:4000/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const questionsData = await response.json();
      setQuestions(questionsData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete question");
      }
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== id)
      );
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };
  const handleAnswerChange = async (id, correctIndex) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correctIndex }),
      });
      if (!response.ok) {
        throw new Error("Failed to update answer");
      }
      const updatedQuestion = await response.json();
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === updatedQuestion.id ? updatedQuestion : question
        )
      );
    } catch (error) {
      console.error("Error updating answer:", error);
    }
  };
  const questionItems = questions.map((question) => (
    <QuestionItem
      key={question.id}
      question={question}
      onDeleteClick={handleDeleteClick}
      onAnswerChange={handleAnswerChange}
    />
  ));
  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>{questionItems}</ul>
    </section>
  );
}
export default QuestionList;