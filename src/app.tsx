import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./app.css"
import MainPage from "./pages/main-page/MainPage"
import LoginPage from "./pages/login-page/LoginPage"
import SignupPage from "./pages/signup-page/SignupPage"
import AddItemPage from "./pages/add-item-page/AddItemPage"
import ItemDetailPage from "./pages/item-detail-page/ItemDetailPage"
import UploadImagePage from "./pages/upload-image-page/UploadImagePage"
import DebtorsPage from "./pages/debtors-page/DebtorsPage"

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/add-item" element={<AddItemPage />} />
          <Route path="/item/:id" element={<ItemDetailPage />} />
          <Route path="/upload-image" element={<UploadImagePage />} />
          <Route path="/debtors" element={<DebtorsPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
