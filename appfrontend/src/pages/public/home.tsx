import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header";
import Footer from "../../components/footer";

const Home: React.FC = () => {
    interface Movie {
        title: string;
        description: string;
        poster: string;
        release_date: string;
    }

    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/movie/get-all-movies"); // API endpoint từ BE
                setMovies(response.data.data); // Giả sử API trả về { data: [...] }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch movies");
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-8">
                <h2 className="text-4xl font-bold mb-6 text-center">Danh Sách Phim</h2>
                {loading ? (
                    <p className="text-center">Đang tải...</p>
                ) : error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {movies.map((movie, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-full h-64 object-cover rounded-md mb-4"
                                />
                                <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
                                <p className="text-gray-600 mb-2">{movie.description}</p>
                                <p className="text-sm text-gray-500">
                                    Ngày phát hành: {new Date(movie.release_date).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Home;
