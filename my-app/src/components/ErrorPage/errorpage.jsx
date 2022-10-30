import Swal from 'sweetalert2'
// import { useNavigate } from 'react-router-dom'

function Errorpage() {

    // const Navigate = useNavigate()

  return (
    Swal.fire({
        title: "error",
        icon: 'error',
        text: `Connect the wallet first!!!`,
      })
  )
}

export default Errorpage