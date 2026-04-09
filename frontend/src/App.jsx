import { useState, useEffect } from "react";

function MovieApp() {
  const API = import.meta.env.VITE_API_URL;

  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState("");
  const [movies, setMovies] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // 📄 GET movies
  async function getMovies() {
    const res = await fetch(`${API}/movies`);
    const data = await res.json();
    setMovies(data);
  }

  useEffect(() => {
    getMovies();
  }, []);

  // ➕ ADD movie
  async function addMovie() {
    if (!title || !rating) return;

    await fetch(`${API}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        rating: Number(rating),
        image: image
      })
    });

    resetForm();
    getMovies();
  }

  // ✏️ UPDATE movie
  async function updateMovie() {
    await fetch(`${API}/movies/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        rating: Number(rating),
        image: image
      })
    });

    resetForm();
    getMovies();
  }

  // ❌ DELETE movie
  async function deleteMovie(id) {
    await fetch(`${API}/movies/${id}`, {
      method: "DELETE"
    });

    getMovies();
  }

  // 🔄 Reset form
  function resetForm() {
    setTitle("");
    setRating("");
    setImage("");
    setEditId(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        🎬 Movie App
      </h1>

      {/* 🔍 Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search movie..."
        className="border p-2 w-full mb-4 max-w-xl mx-auto block"
      />

      {/* 📝 Form */}
      <div className="max-w-xl mx-auto bg-white p-4 rounded shadow mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Movie title"
          className="border p-2 w-full mb-2"
        />

        <input
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Rating"
          className="border p-2 w-full mb-2"
        />

        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
          className="border p-2 w-full mb-2"
        />

        <button
          onClick={editId ? updateMovie : addMovie}
          className="bg-blue-500 text-white px-4 py-2 w-full rounded"
        >
          {editId ? "Update Movie" : "Add Movie"}
        </button>
      </div>

      {/* 🎴 Movie Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies
          .filter((m) =>
            m.title.toLowerCase().includes(search.toLowerCase())
          )
          .map((m) => (
            <div
              key={m._id}
              className="bg-white shadow-lg rounded-xl overflow-hidden"
            >
              {/* 🖼️ Image */}
              <img
                src={m.image || "https://via.placeholder.com/300"}
                alt={m.title}
                className="w-full h-48 object-cover"
              />

              {/* 📄 Content */}
              <div className="p-4">
                <h2 className="text-lg font-bold">{m.title}</h2>
                <p className="text-gray-600">⭐ {m.rating}</p>

                {/* 🔘 Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setTitle(m.title);
                      setRating(m.rating);
                      setImage(m.image || "");
                      setEditId(m._id);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteMovie(m._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MovieApp;