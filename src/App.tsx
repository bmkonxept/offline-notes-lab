import Home from "./pages/Home";
import "./index.css";

export default function App() {
  return (
    <>
      <Home />

      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "14px",
          borderTop: "1px solid #e5e4e7",
          marginTop: "20px",
        }}
      >
        <p><strong>NAME:</strong> OLAYIWOLA HALLELUYAH OBALOLUWA</p>
        <p><strong>MATRIC NO:</strong> 2024/1/100150EE</p>
        <p>
          <strong>DEPARTMENT:</strong> DEPARTMENT OF ELECTRICAL AND ELECTRONICS
          ENGINEERING
        </p>
      </footer>
    </>
  );
}