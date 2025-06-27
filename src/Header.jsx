import { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

const style1 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    boxShadow: 24,
    p: 4,
};

const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    boxShadow: 24,
    p: 4,
};

function Header() {
    const [about, setAbout] = useState(false);
    const openAbout = () => setAbout(true);
    const closeAbout = () => setAbout(false);

    const [why, setWhy] = useState(false);
    const openWhy = () => setWhy(true);
    const closeWhy = () => setWhy(false);

    const photos = [
        'src/assets/meSalute.jpg',
        'src/assets/meBackhandspring.jpg',
        'src/assets/meDance.jpg',
    ]

    const [curr, setCurr] = useState(0);
    const imgSrc = photos[curr]

    const rotateLeft = () => {
        setCurr((curr + 1) % photos.length)
    }

    const rotateRight = () => {
        setCurr((curr - 1 + photos.length) % photos.length)
    }

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
                <Box className={"bg-white rounded-xl"} sx={style1}>
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

            <div className={'flex items-center'}>
                <button className={'bg-blue-100 hover:bg-white max-h-10 p-2 rounded-xl font-bold text-blue-950 me-4'} onClick={openWhy}>Why</button>
            </div>
            <Modal
                open={why}
                onClose={closeWhy}
            >
                <Box className={"bg-white rounded-xl"} sx={style2}>
                    <h3 className={"text-xl font-bold bg-yellow-400/25 p-2 rounded-xl"}>Why Meets Me</h3>
                    <p className={"mx-2 mt-4"}>Curious about why Meets Me came to be? Here is a little bit about me and why I chose to made.</p>

                    <h4 className={'mx-2 font-bold mt-4 text-lg'}>Meet the Creator</h4>
                    <div className={'flex flex-row mb-4'}>
                        <div className={'flex flex-col min-w-[270px]'}>
                            <img src={imgSrc} className={'mt-4 h-auto max-h-[400px] w-auto object-contain rounded-xl'} alt={'A photo of the creator saluting the judges.'}/>
                            <div className={'flex flex-row items-center justify-center gap-10 mt-1'}>
                                <button className={'p-2 bg-blue-500/75 rounded-xl'} onClick={rotateLeft}>{'<'}</button>
                                <button className={'p-2 bg-blue-500/75 rounded-xl'} onClick={rotateRight}>{'>'}</button>
                            </div>
                        </div>
                        <div className={'mt-2 ms-4'}>
                            <p className={'mb-2'}>Hi! My name is Katherine and I was a competitive gymnast for 9 years.</p>
                            <p className={'mb-2'}>During my time competing, I often found myself looking back at my scores, and I really felt like the current score tracking website was kind of a pain.</p>
                            <p className={'mb-2'}>I had also started to wonder if the events that I considered my bests were actually my best based on scores.</p>
                            <p className={''}>This led me to create Meets Me which not only lets you save all your scores in one place, but also generates averages and top scores so that you can see what events your're scoring the best at.</p>
                        </div>
                    </div>

                    <div className={'flex justify-between items-center'}>
                        <p className={"mx-2 mt-4"}>I hope you enjoy Meets Me!</p>
                        <button className={'me-2 bg-yellow-400 p-2 rounded-xl font-bold hover:bg-yellow-500'} onClick={closeWhy}>Close</button>
                    </div>
                </Box>
            </Modal>
        </div>
    </header>
}

export default Header;