import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header";
import Footer from "../../components/footer";

interface User {
    _id: string;
    full_name: string;
    email: string;
    role: string;
}

interface Theater {
    _id: string;
    name: string;
    location: string;
    capacity: number;
}

interface Movie {
    _id: string;
    title: string;
    genre: string[];
    rating: number;
}

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersRes, theatersRes, moviesRes] = await Promise.all([
                    axios.get("/api/admin/get-all-users"),
                    axios.get("/api/theater/get-all-theaters"),
                    axios.get("/api/movie/get-all-movies"),
                ]);

                setUsers(usersRes.data.data);
                setTheaters(theatersRes.data.data);
                setMovies(moviesRes.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center mt-10">Đang tải...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <main className="flex-grow container mx-auto p-8">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Users</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Email</th>
                                    <th className="px-4 py-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b">
                                        <td className="px-4 py-2">{user.full_name}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Theaters</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Location</th>
                                    <th className="px-4 py-2">Capacity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {theaters.map((theater) => (
                                    <tr key={theater._id} className="border-b">
                                        <td className="px-4 py-2">{theater.name}</td>
                                        <td className="px-4 py-2">{theater.location}</td>
                                        <td className="px-4 py-2">{theater.capacity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Movies</h2>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full bg-white shadow-md rounded-lg">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    <th className="px-4 py-2">Title</th>
                                    <th className="px-4 py-2">Genre</th>
                                    <th className="px-4 py-2">Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map((movie) => (
                                    <tr key={movie._id} className="border-b">
                                        <td className="px-4 py-2">{movie.title}</td>
                                        <td className="px-4 py-2">{movie.genre.join(", ")}</td>
                                        <td className="px-4 py-2">{movie.rating}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
