import React, { useState, useEffect } from "react";
import ReactButton from "./ReactButton";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const CACHE_KEY = "passop_passwords";

const getCachedPasswords = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw).data;
  } catch {
    return null;
  }
};

const setCachedPasswords = (data) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ data, timestamp: Date.now() })
  );
};

const clearCachedPasswords = () => {
  localStorage.removeItem(CACHE_KEY);
};

const Manager = () => {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copyToast, setCopyToast] = useState("");
  const [editId, setEditId] = useState(null);
  const [buttonText, setButtonText] = useState("Save");
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const savePassToast = () => toast("Password saved successfully!");

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopyToast("Copied!");
    setTimeout(() => setCopyToast(""), 2000);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  // Fetch passwords from backend
  const fetchPasswords = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPasswordArray(data);
        setCachedPasswords(data);
      } else {
        console.error("Failed to fetch passwords:", await res.json());
      }
    } catch (err) {
      console.error("Error fetching passwords:", err);
    }
  };

  // Load cached passwords first, then revalidate
  useEffect(() => {
    const cached = getCachedPasswords();
    if (cached) setPasswordArray(cached);
    fetchPasswords();
  }, []);

  // Save or update a password
  const savePassword = async () => {
    if (!form.site || !form.username || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${BACKEND_URL}/${editId}` : `${BACKEND_URL}/`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        savePassToast();
        setForm({ site: "", username: "", password: "" });
        setEditId(null);
        setButtonText("Save");
        fetchPasswords();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Error saving password");
      }
    } catch (err) {
      console.error("Error saving password:", err);
    }
  };

  const handleEdit = (item) => {
    setForm({
      site: item.site,
      username: item.username,
      password: item.password,
    });
    setEditId(item._id);
    setButtonText("Update");
  };

  const deletePassword = (id) => setDeleteId(id);

  const confirmDeletePassword = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        toast("Password deleted successfully!");
        fetchPasswords();
      } else {
        toast.error("Failed to delete password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting password");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      <ToastContainer />

      {/* Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-200 opacity-20 blur-[100px]"></div>
      </div>

      {/* Heading */}
      <div className="flex flex-row justify-center items-center gap-2 p-4">
        <h1 className="font-extrabold text-3xl text-black text-outline">
          Password
        </h1>
        <h1 className="font-extrabold text-3xl text-emerald-600 text-outline">
          Manager
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="text-emerald-950 grid grid-cols-1 md:grid-cols-3 gap-3 p-4"
      >
        <input
          type="text"
          value={form.site}
          onChange={(e) => setForm({ ...form, site: e.target.value })}
          placeholder="https://example.com/"
          autoComplete="website"
          className="border-green-500 p-2 rounded-full bg-slate-100 border w-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400"
        />
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="Username or XYZ@gmail.com"
          autoComplete="username"
          className="border-green-500 p-2 rounded-full bg-slate-100 border w-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400"
        />
        <div className="relative w-full">
          <input
            type={show ? "text" : "password"}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password"
            autoComplete="current-password"
            className="border-green-500 p-2 rounded-full bg-slate-100 border w-full focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-400 pr-10"
          />
          <img
            src={show ? "./eye.png" : "./hidden.png"}
            alt="toggle"
            className="w-6 h-6 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShow(!show)}
          />
        </div>
      </form>

      {/* Save Button */}
      <div className="flex flex-row gap-2 p-4 justify-center">
        <ReactButton
          onClick={savePassword}
          text={buttonText}
          icon={
            <lord-icon
              src="https://cdn.lordicon.com/efxgwrkc.json"
              trigger="hover"
              target="button"
            ></lord-icon>
          }
        />
      </div>

      {/* Password Table */}
      {passwordArray.length > 0 ? (
        <div className="p-4">
          <h2 className="inline-block mb-3">
            <span className="bg-green-200 text-green-800 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1">
              🔒 Saved Passwords
            </span>
          </h2>
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto border border-black rounded">
              <thead>
                <tr className="bg-green-800 text-white">
                  <th className="border px-2 py-1">Website</th>
                  <th className="border px-2 py-1">Username</th>
                  <th className="border px-2 py-1">Password</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {passwordArray.map((item) => (
                  <tr
                    key={item._id}
                    className="text-center bg-green-100 text-black"
                  >
                    <td className="border border-white px-2 py-1 relative pr-10">
                      <span>{item.site}</span>
                      <span
                        onClick={() => copyToClipboard(item.site)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="click"
                          style={{ width: "20px", height: "20px" }}
                        />
                      </span>
                    </td>
                    <td className="border border-white px-2 py-1 relative pr-10">
                      <span>{item.username}</span>
                      <span
                        onClick={() => copyToClipboard(item.username)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="click"
                          style={{ width: "20px", height: "20px" }}
                        />
                      </span>
                    </td>
                    <td className="border border-white px-2 py-1 relative pr-16">
                      <span className="font-mono">
                        {visiblePasswords[item._id]
                          ? item.password
                          : "•".repeat(8)}
                      </span>
                      <img
                        src={
                          visiblePasswords[item._id]
                            ? "./eye.png"
                            : "./hidden.png"
                        }
                        alt="toggle"
                        className="w-5 h-5 absolute right-10 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => togglePasswordVisibility(item._id)}
                      />
                      <span
                        onClick={() => copyToClipboard(item.password)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        <lord-icon
                          src="https://cdn.lordicon.com/iykgtsbt.json"
                          trigger="click"
                          style={{ width: "20px", height: "20px" }}
                        />
                      </span>
                    </td>
                    <td className="border border-white px-2 py-1">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="hover:bg-yellow-300 px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/gwlusjdu.json"
                            trigger="hover"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </button>
                        <button
                          onClick={() => deletePassword(item._id)}
                          className="hover:bg-red-400 px-3 py-1.5 rounded-lg cursor-pointer"
                        >
                          <lord-icon
                            src="https://cdn.lordicon.com/xyfswyxf.json"
                            trigger="hover"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-16 text-center text-gray-700">
          <lord-icon
            src="https://cdn.lordicon.com/egiwmiit.json"
            trigger="loop"
            delay="2000"
            colors="primary:#10b981"
            style={{ width: "90px", height: "90px" }}
          />
          <h3 className="text-xl font-semibold mt-4">Your vault is empty</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">
            Add your first password using the form above. Everything you save
            will appear here securely.
          </p>
        </div>
      )}

      {/* Copy Toast */}
      {copyToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg animate-fade">
          {copyToast}
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-4 w-80 animate-scaleIn">
            <div className="flex flex-col items-center text-center gap-2">
              <lord-icon
                src="https://cdn.lordicon.com/tdrtiskw.json"
                trigger="loop"
                colors="primary:#ef4444"
                style={{ width: "50px", height: "50px" }}
              />
              <h3 className="text-lg font-semibold text-gray-800">
                Delete this password?
              </h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>
              <div className="flex justify-between gap-2 mt-4 w-full">
                <button
                  onClick={() => setDeleteId(null)}
                  className="cursor-pointer flex-1 px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDeletePassword()}
                  className=" cursor-pointer flex-1 px-3 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Manager;
