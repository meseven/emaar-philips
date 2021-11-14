import {PanZoom} from "react-easy-panzoom";
import {useState, useEffect, useRef} from "react";
import {BsPlusLg} from "react-icons/bs"
import {BiMinus} from "react-icons/bi"
import {BsAlignCenter} from "react-icons/bs"
import {IoMdArrowDropdown} from "react-icons/io"

import { Menu, Dropdown, Button, message, Space, Tooltip } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';


function ZoomArea({children}) {

    const zoomArea = useRef()
    const [center, setCenter] = useState(false)

    const zoomOut = () => {
        zoomArea.current.zoomOut(1.5)
    }
    const zoomIn = () => {
        zoomArea.current.zoomIn(1.5)
    }
    const resetZoom = () => {
        zoomArea.current.autoCenter(0.9)
    }

    useEffect(() => {
        setTimeout(() => setCenter(true), 1)
    }, []);

    function handleMenuClick(e) {
        console.log('click', e);
    }

    const menu = (
        <Menu className="room-dropdown" onClick={handleMenuClick}>
            <Menu.Item key="1">
                Room 1
            </Menu.Item>
            <Menu.Item key="2">
                Room 2
            </Menu.Item>
            <Menu.Item key="3">
                Room 3
            </Menu.Item>
        </Menu>
    );

    return (
        <>
            <div className="zoom-header">
                <h3>Thermostats</h3>
                <nav className="zoom-nav">
                    <label className="colorpicker">
                        <span></span>
                        <input type="color" onChange={e => document.documentElement.style.setProperty('--zoom-color', e.target.value)} />
                    </label>
                    <Dropdown.Button className="room-select" trigger="click" overlay={menu} placement="bottomRight" icon={<IoMdArrowDropdown size={20} />}>
                        Room 1
                    </Dropdown.Button>
                </nav>
            </div>
            <div className="zoom-container">
                <PanZoom ref={zoomArea} autoCenterZoomLevel="0.9" autoCenter={center}>
                    {children}
                </PanZoom>

                <div className="zoom-actions">
                    <button onClick={zoomOut}>
                        <BiMinus size={22}/>
                    </button>
                    <button onClick={zoomIn}>
                        <BsPlusLg size={15}/>
                    </button>
                </div>

                <div className="zoom-reset">
                    <button onClick={resetZoom}>
                        <BsAlignCenter size={22}/>
                    </button>
                </div>
            </div>

        </>
    )
}

export default ZoomArea