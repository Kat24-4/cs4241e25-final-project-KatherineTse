import { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    boxShadow: 24,
    p: 4,
};

function Header() {
    const [about, setAbout] = useState(false);
    const openAbout = () => setAbout(true);
    const closeAbout = () => setAbout(false);

    return <header className="my-1">
        <div style={{height: "100px"}} className="flex m-2 px-3 py-1 bg-blue-500/50 rounded-xl">
            <img id="gymnastHandstand" src="src/assets/gymnastHandstand.png" className="flex-none py-1 px-2"
                 alt="Silhouette of a gymnast doing a handstand"/>

            <div className="headerCenter flex-1 content-center px-3">
                <h1 className="text-4xl font-['Raleway']">Meets Me - Gymnastics</h1>
                <h2 className="text-2xl">All of Your Scores in Once Place!</h2>
            </div>

            <div className={'flex items-center'}>
                <button className={'bg-blue-100 hover:bg-white max-h-10 p-2 rounded-xl font-bold text-blue-950 me-4'} onClick={openAbout}>About</button>
            </div>
            <Modal
                open={about}
                onClose={closeAbout}
            >
                <Box className={"bg-white rounded-xl"} sx={style}>
                    <h3 className={"text-xl font-bold bg-yellow-400/25 p-2 rounded-xl"}>About Meets Me</h3>
                    <p className={"mx-2 mt-4"}>Meets Me is a gymnastics competition personal score tracker made by a gymnast for gymnasts.</p>
                    <p className={"mx-2 mt-2"}>Here you can quickly see all of your competition scores in one place. You can even generate analytics about your scores from specific level or year. A full list of features can be found below.</p>

                    <h4 className={'mx-2 font-bold mt-4 text-lg'}>Features</h4>
                    <ul className={"list-disc ml-8 mt-1"}>
                        <li>Sleek data table that can sort, filter, and export your data</li>
                        <li>Easy-to-use forms that add, edit, and delete meet entries</li>
                        <li>Analytics that show your average and top scores</li>
                        <li>All your data on one page in just a few clicks</li>
                        <li>Supports Excel and Junior Olympic tracks</li>
                        <li>Quick links to important gymnastics info</li>
                        <li>Simple login and account creation</li>
                        <li>Color-blind friendly color palette</li>
                        <li>Easy to read fonts</li>
                    </ul>

                    <div className={'flex justify-between itesm-center'}>
                        <p className={"mx-2 mt-4"}>Enjoy Meets Me!</p>
                        <button className={'me-2 bg-yellow-400 p-2 rounded-xl font-bold hover:bg-yellow-500'} onClick={closeAbout}>Close</button>
                    </div>
                </Box>
            </Modal>
        </div>
    </header>
}

export default Header;