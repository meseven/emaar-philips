import {NavLink} from "react-router-dom";
import {AiFillHome} from "react-icons/ai"
import {BiWater} from "react-icons/bi"
import {FaServer, FaCog} from "react-icons/fa"
import {GrSchedule} from "react-icons/gr"
import {GiHeatHaze} from "react-icons/gi"

function Nav() {
    return (
        <nav className="menu">
            <NavLink activeClassName="active" exact to="/">
                <AiFillHome size={20}/>
            </NavLink>
            <NavLink activeClassName="active" to="/trench-heaters">
                <GiHeatHaze size={20}/>
            </NavLink>
            <NavLink activeClassName="active" to="/water-leakages">
                <BiWater size={20}/>
            </NavLink>
            <NavLink activeClassName="active" to="/server-rooms">
                <FaServer size={20} />
            </NavLink>
            <NavLink activeClassName="active" to="/weekly-program">
                <GrSchedule size={20} />
            </NavLink>
            <NavLink activeClassName="active" to="/settings">
                <FaCog size={20} />
            </NavLink>
        </nav>
    )
}

export default Nav