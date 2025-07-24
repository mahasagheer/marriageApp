import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FiMapPin, FiUsers, FiDollarSign } from "react-icons/fi";
import { Button } from "../Components/Layout/Button";
import { useDispatch, useSelector } from "react-redux";
import { searchHalls } from "../slice/hallSlice";
import { NavBar } from '../Components/Layout/navbar';
import { Footer } from '../Components/Layout/Footer';




function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ITEMS_PER_PAGE = 10;

const SearchResults = () => {
  const query = useQuery();
  const dispatch = useDispatch();
  const { searchResults: halls, loading, error } = useSelector((state) => state.halls);

  const name = query.get("name") || "";
  const location = query.get("location") || "";

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(searchHalls({ name, location }));
  }, [dispatch, name, location]);

  // Pagination logic
  const totalPages = Math.ceil(halls.length / ITEMS_PER_PAGE);
  const paginatedHalls = halls.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const renderPagination = () => (
    totalPages > 1 && (
      <div className="flex justify-center mt-8 gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-marriagePink/30 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`px-3 py-1 rounded font-bold transition-all duration-150 ${page === idx + 1 ? "bg-marriageHotPink text-white shadow" : "bg-gray-100 hover:bg-marriagePink/20 text-marriageHotPink"}`}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 rounded bg-gray-200 hover:bg-marriagePink/30 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    )
  );

  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-gradient-to-br from-white via-marriagePink/10 to-marriagePink/5 font-sans px-4 flex flex-col">
      {/* Header placeholder */}
      <div className="">{/* Add Navbar/Header here */}</div>
      <div className="max-w-6xl mx-auto w-full flex-1">
        <h2 className="text-4xl font-extrabold text-marriageHotPink mb-10 text-center tracking-tight drop-shadow-lg text-2xl sm:text-3xl md:text-4xl px-2">Search Results</h2>
        {loading ? (
              <div className="loader"></div>
            ) : error ? (
          <div className="text-center text-marriageRed text-lg font-semibold">{error}</div>
        ) : halls.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center text-gray-400 text-lg sm:text-xl font-semibold border border-marriagePink/20 mx-2">No halls found matching your criteria.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-1 sm:px-0">
              {paginatedHalls.map((hall) => (
                <div
                  key={hall._id}
                  className="flex flex-col bg-white rounded-2xl shadow-lg border border-marriagePink/10 overflow-hidden hover:shadow-2xl transition-all duration-200 cursor-pointer group relative min-h-[420px] sm:min-h-[440px]"
                  onClick={() => window.location.href = `/public-halls/${hall._id}`}
                >
                  {/* Hall Image */}
                  <div className="w-full h-40 sm:h-48 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                    <img
                      src={
                        hall.images && hall.images.length > 0
                          ? `http://localhost:5000/${hall.images[0].replace(/\\/g, '/').replace(/^uploads\//, 'uploads/')}`
                          : 'https://via.placeholder.com/220x160?text=Hall+Image'
                      }
                      alt={hall.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full shadow">Active</span>
                  </div>
                  {/* Hall Info */}
                  <div className="flex-1 flex flex-col p-4 sm:p-6 gap-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg sm:text-xl font-bold text-marriageHotPink truncate">{hall.name}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-2 gap-2">
                      <FiMapPin className="mr-1" /> <span>{hall.location}</span>
                    </div>
                    <div className="text-gray-600 text-base mb-2 min-h-[48px]">
                      {hall.description && hall.description.length > 120
                        ? `${hall.description.substring(0, 120)}...`
                        : hall.description}
                    </div>
                    <div className="flex items-center gap-4 text-gray-500 text-xs mb-2">
                      <span className="flex items-center gap-1"><FiUsers /> {hall.capacity || 0} Guests</span>
                      <span className="flex items-center gap-1"><FiDollarSign /> {hall.price || 0} PKR</span>
                    </div>
                    <div className="mt-auto flex justify-end">
                      <Button
                        btnText={"Book hall"}
                        btnColor="marriageHotPink"
                        padding="px-4 py-2"
                        onClick={e => { e.stopPropagation(); window.location.href = `/public-halls/${hall._id}`; }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </div>
      {/* Footer placeholder */}
    </div>
      <div className="mt-16"><Footer/></div>
    </>
  );
};

export default SearchResults; 