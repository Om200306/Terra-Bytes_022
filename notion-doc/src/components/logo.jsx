
import logo from "../assets/logo_light.png"

export function Logo(){
  return(
    <div className="hidden md:flex items-center gap-x-2">
        <img src={logo} height="40" width="40" alt="Logo Img" />
        <p className="font-bold text-xl">
          Totion
        </p>
    </div>
  )
}