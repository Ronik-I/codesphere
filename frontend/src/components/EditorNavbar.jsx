
import { FiDownload } from "react-icons/fi";


const EditorNavbar = () => {
  return (
    <>
      <div className="EditorNavbar flex items-center justify-between px-[100px] h-[25px] bg-[#141414]">
        
        <p>File / <span className='text-[gray]'>My first project</span></p>
        <i className='p-[4px] btn bg-black rounded-[5px] cursor-pointer text-[20px]'><FiDownload /></i>
      </div>
    </>
  )
}

export default EditorNavbar