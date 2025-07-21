import { Link,  useSubmit } from "@remix-run/react";
import { RiFolderAddFill } from "react-icons/ri";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { CiEdit } from "react-icons/ci";
import { AiOutlineDelete } from "react-icons/ai";
import { useState } from "react";
import { IoIosLink } from "react-icons/io";
import ConfirmModal from "./ConfirmModal";
import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";



export default function SpacesList({ spaces }) {
  
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState(null);
  
  const submit = useSubmit();

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  

  const handleLink = async (id) => {
    const publicLink = `${window.location.origin}/${id}`
    try{
     await navigator.clipboard.writeText(publicLink);
    toast.success("Link copied to clipboard!");
    setOpenMenuId(null);
      
    }
    catch (err) {
    toast.error("Failed to copy the link.");
    console.error(err);
  }

  }

  const handleDeleteClick = (id) => {
    setSpaceToDelete(id);
    setShowConfirm(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = () => {
    const formData = new FormData();
    formData.append("spaceId", spaceToDelete);
    submit(formData, { method: "post", action: "/space/delete" });
    setShowConfirm(false);
    setSpaceToDelete(null);
  };

 return (
  <>
    <h1 className="text-[42px] font-black text-white tracking-tight mb-6">Spaces</h1>

    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      {spaces.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border border-white/10 rounded-3xl px-10 py-16 text-center space-y-6 min-h-[340px] flex flex-col justify-center items-center shadow-2xl backdrop-blur-md">
          <RiFolderAddFill className="text-gray-400 text-6xl animate-pulse" />
          <div>
            <p className="text-white text-[28px] font-semibold mb-1">No Spaces Yet!</p>
            <p className="text-sm text-gray-400">Create your first space and start collecting testimonials.</p>
          </div>
          <Link
            to="/space/create"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-6 rounded-xl shadow-lg transition duration-300 flex gap-2 items-center"
          >
            <IoMdAdd size={20} />
            Create New Space
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-10">
            <Link
              to="/space/create"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md transition-transform duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <IoMdAdd size={20} />
              Create New Space
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {spaces.map((space) => (
              <div
                key={space._id}
                className="relative rounded-3xl p-6 bg-white/5 border border-white/10 shadow-xl backdrop-blur-lg transition-all duration-300 hover:scale-[1.015]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={space.avatar}
                      alt={space.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-md mr-4 border-2 border-white/10"
                    />
                    <div>
                      <Link
                        to={`/space/${space._id}`}
                        className="text-xl font-semibold text-white hover:underline"
                      >
                        {space.name}
                      </Link>
                      <p className="text-sm text-gray-400">{space.HeaderTitle}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => toggleMenu(space._id)}
                      className="text-gray-300 hover:text-white p-2 rotate-90 transition"
                    >
                      <HiOutlineDotsVertical size={22} />
                    </button>

                    {openMenuId === space._id && (
                      <div className="absolute right-0 mt-2 w-44 bg-gray-900 text-white rounded-xl shadow-lg z-30 py-1 border border-white/10">
                        <button
                          onClick={() => handleLink(space._id)}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-800 gap-2"
                        >
                          <IoIosLink size={18} />
                          <span>Get Link</span>
                        </button>
                        <Link
                          to={`/space/${space._id}/edit`}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-800 gap-2"
                          onClick={() => setOpenMenuId(null)}
                        >
                          <CiEdit size={18} />
                          <span>Edit Space</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(space._id)}
                          className="flex items-center w-full px-4 py-2 text-sm hover:bg-red-600 gap-2 text-red-400 hover:text-white"
                        >
                          <AiOutlineDelete size={18} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-300 mb-5">{space.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-gray-400 font-medium">Testimonials</span>
                  <span className="bg-blue-600/10 text-blue-400 font-semibold px-3 py-1 rounded-full text-sm">
                    {space.totalTestimonials}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>

    <ConfirmModal
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={handleConfirmDelete}
      message="Are you sure you want to delete this space? This action cannot be undone."
    />
  </>
);

}
