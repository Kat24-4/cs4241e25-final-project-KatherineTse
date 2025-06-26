import { useState, useEffect } from 'react'
import { DataGrid, gridClasses } from '@mui/x-data-grid'
import {alpha, styled} from "@mui/material";

const ODD_OPACITY = 0.15;

const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
    [`& .${gridClasses.row}.even`]: {
        backgroundColor:  theme.palette.grey[200],
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
    [`& .${gridClasses.row}.odd`]: {
        backgroundColor: '#ffffff',
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    }
}));

function App() {
    const renderEditButton = (params) => {
        return (
            <button className="p-2 m-[6px] rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={ () => swapForm("editForm", params.row.editButton) }>Edit Entry</button> //text-center rounded-xl text-blue-600 font-bold underline hover:no-underline hover:text-blue-900
        );
    }

    const columns = [
        {field: 'id', headerName: 'ID', width: 50, display: 'flex'},
        {field: 'compInfo', headerName: 'Competition Information', width: 300, display: 'flex'},
        {field: 'level', headerName: 'Level', width: 100, display: 'flex'},
        {field: 'vaultScore', headerName: 'Vault Score', width: 105, display: 'flex'},
        {field: 'barScore', headerName: 'Bar Score', width: 105, display: 'flex'},
        {field: 'beamScore', headerName: 'Beam Score', width: 105, display: 'flex'},
        {field: 'floorScore', headerName: 'Floor Score', width: 105, display: 'flex'},
        {field: 'totalScore', headerName: 'Total Score', width: 105, display: 'flex'},
        {field: 'editButton', headerName: 'Edit', width: 120, renderCell: renderEditButton, display: 'flex' },
    ]

    // Sends request to server to get data when website is first loaded.
    // Calls function to display data if there is any or sends alter to new user that their account has successfully been created
    useEffect( () => {

        async function loadData() {
            // send Get request asking for data
            const response = await fetch("/api/loadData", {
                method: "GET",
            })

            // wait for data and then send it to be displayed
            const appdata = await response.text()

            const data = JSON.parse(appdata)

            if (data === "new") {
                alert("New user created with username and password. Welcome!");
            } else {
                parseData(data);
            }
        }
        loadData()

    }, [])

    const [id, setId] = useState('');
    const [compInfo, setCompInfo] = useState('');
    const [level, setLevel] = useState('');
    const [vaultScore, setVaultScore] = useState('');
    const [barScore, setBarScore] = useState('');
    const [beamScore, setBeamScore] = useState('');
    const [floorScore, setFloorScore] = useState('');

    const [rows, setRows] = useState([]);

    const [hideAdd, setHideAdd] = useState(true);
    const [hideEdit, setHideEdit] = useState(true);
    const [hideDelete, setHideDelete] = useState(true);

    const [avgVault, setAvgVault] = useState('');
    const [avgBar, setAvgBar] = useState('');
    const [avgBeam, setAvgBeam] = useState('');
    const [avgFloor, setAvgFloor] = useState('');
    const [avgTotal, setAvgTotal] = useState('');

    const [topVault, setTopVault] = useState('');
    const [topBars, setTopBars] = useState('');
    const [topBeam, setTopBeam] = useState('');
    const [topFloor, setTopFloor] = useState('');
    const [topTotal, setTopTotal] = useState('');

    /*
    * Name: addEntry
    * Input: onClick event
    * Output: N/A
    * Purpose: Collect data for new entry, send it to server, send updated data from server to be displayed
    */
    async function addEntry(event) {
        event.preventDefault();

        // send object to server with the proper data format
        const json = {"compInfo": compInfo, "level": level, "vaultScore": vaultScore, "barScore": barScore, "beamScore": beamScore, "floorScore": floorScore},
            body = JSON.stringify(json)

        const response = await fetch("/api/submit", {
            method: "POST",
            body
        })

        // wait for response from server
        const appdata = await response.text()

        const data = JSON.parse(appdata)

        // send data sent from server to be displayed and reset the form
        parseData(data)
        clearForm()
        setHideAdd(true)
    }

    /*
    * Name: delEntry
    * Input: onClick event
    * Output: N/A
    * Purpose: Collect data for entry to be deleted, send data to server, send updated data from server to be displayed
    */
    async function delEntry(event) {
        event.preventDefault();

        const body = JSON.stringify(id)

        // send ID to server
        const response = await fetch("/api/submit", {
            method: "POST",
            body
        })

        // wait for response from server
        const appdata = await response.text()

        const data = JSON.parse(appdata)

        // send data sent from server to be displayed and reset the form
        parseData(data)
        setId('')
        setHideDelete(true)
    }

    /*
    * Name: editEntry
    * Input: onClick event
    * Output: N/A
    * Purpose: Collect data for entry to be updated, send data to server, send updated data from server to be displayed
    */
    async function editEntry(event) {
        event.preventDefault();

        // send object to server with the proper data format
        const json = {"id": id, "compInfo": compInfo, "level": level, "vaultScore": vaultScore, "barScore": barScore, "beamScore": beamScore, "floorScore": floorScore},
            body = JSON.stringify(json)

        const response = await fetch("/api/submit", {
            method: "POST",
            body
        })

        // wait for response from server
        const appdata = await response.text()

        const data = JSON.parse(appdata)

        // send data sent from server to be displayed, reset the form, swap to AddEntry form
        parseData(data)
        clearForm()
        setHideEdit(true)
    }

    /*
    * Name: clearEntryForm
    * Input: N/A
    * Output: N/A
    * Purpose: clear add form
    */
    const clearForm = () => {
        setId('')
        setCompInfo('');
        setLevel('');
        setVaultScore('');
        setBarScore('');
        setBeamScore('');
        setFloorScore('');

        document.getElementById('bronze').checked = false
        document.getElementById('silver').checked = false
        document.getElementById('gold').checked = false
        document.getElementById('platinum').checked = false
        document.getElementById('diamond').checked = false
    }

    /*
    * Name: swapForm
    * Input: name of form to be displayed, data object for edit form (if applicable)
    * Output: N/A
    * Purpose: Swap what form is being displayed
    */
    const swapForm = (form, prefillData) => {
        // hide other forms and display the proper one
        if (form === "addForm") {
            setHideAdd(false)
            setHideDelete(true)
            setHideEdit(true)
            clearForm()
        } else if (form === "delForm") {
            setHideAdd(true)
            setHideDelete(false)
            setHideEdit(true)
            setId('')
        } else if (form === "editForm") {
            setHideAdd(true)
            setHideDelete(true)
            setHideEdit(false)
            clearChecks()
            prefillEdit(prefillData); // send edit data to be prefilled into form
        }
    }

    /*
    * Name: prefillEdit
    * Input: object with data to be put into form
    * Output: N/A
    * Purpose: Prefill edit form with existing data in the entry
    */
    const prefillEdit = (info) => {
        // assign each form element the corresponding value from the current data entry
        setId(info.id)
        setCompInfo(info.compInfo)
        setLevel(info.level)
        setVaultScore(info.vaultScore)
        setBarScore(info.barScore)
        setBeamScore(info.beamScore)
        setFloorScore(info.floorScore)

        // select the proper radio button to check based on current data
        if (info.level === "Bronze") {
            document.getElementById('editBronze').checked = true
        } else if (info.level === "Silver") {
            document.getElementById('editSilver').checked = true
        } else if (info.level === "Gold") {
            document.getElementById('editGold').checked = true
        } else if (info.level === "Platinum") {
            document.getElementById('editPlatinum').checked = true
        } else if (info.level === "Diamond") {
            document.getElementById('editDiamond').checked = true
        } else if (info.level === "Sapphire") {
            document.getElementById('editSapphire').checked = true
        }
    }

    const clearChecks = () => {
        document.getElementById('editBronze').checked = false
        document.getElementById('editSilver').checked = false
        document.getElementById('editGold').checked = false
        document.getElementById('editPlatinum').checked = false
        document.getElementById('editDiamond').checked = false
        document.getElementById('editSapphire').checked = false
    }

    const parseData = (data) => {
        let newRows = []

        let aVault = 0;
        let aBar = 0;
        let aBeam = 0;
        let aFloor = 0;
        let aTotal = 0;

        let tVault = 0;
        let tBar = 0;
        let tBeam = 0;
        let tFloor = 0;
        let tTotal = 0;

        let num = 0;

        data.forEach((item) => {
            let entry = {
                id: item.id,
                compInfo: item.compInfo,
                level: item.level,
                vaultScore: item.vaultScore,
                barScore: item.barScore,
                beamScore: item.beamScore,
                floorScore: item.floorScore,
                totalScore: item.totalScore,
                editButton: item,
            }

            newRows.push(entry)

            aVault += Number(item.vaultScore)
            aBar += Number(item.barScore)
            aBeam += Number(item.beamScore)
            aFloor += Number(item.floorScore)
            aTotal += Number(item.totalScore)
            num++

            if (item.vaultScore > tVault) { tVault = item.vaultScore }
            if (item.barScore > tBar) { tBar = item.barScore }
            if (item.beamScore > tBeam) { tBeam = item.beamScore }
            if (item.floorScore > tFloor) { tFloor = item.floorScore }
            if (item.totalScore > tTotal) { tTotal = item.totalScore }
        })

        setRows(newRows)

        setAvgVault(`${Math.round(aVault/num * 1000) / 1000}`)
        setAvgBar(`${Math.round(aBar/num * 1000) / 1000}`)
        setAvgBeam(`${Math.round(aBeam/num * 1000) / 1000}`)
        setAvgFloor(`${Math.round(aFloor/num * 1000) / 1000}`)
        setAvgTotal(`${Math.round(aTotal/num * 1000) / 1000}`)

        setTopVault(`${tVault}`)
        setTopBars(`${tBar}`)
        setTopBeam(`${tBeam}`)
        setTopFloor(`${tFloor}`)
        setTopTotal(`${tTotal}`)
    }

    return <main className="formAndEntries flex-c justify-center items-center">
        <p className="text-[22px] mb-4 mx-30"><strong>Welcome to your personal score tracker!</strong> You can add and delete
            competitions by clicking on the buttons below and filling out the forms. All competitions added will be
            displayed in the table below. The "Edit Entry" button, will open a form that will update entries stored.</p>

        <div className={'flex flex-wrap justify-center mt-8'}>
            <section className={'flex-c'}>
                <h3 className={'font-bold text-2xl'}>Competition Entries</h3>
                <div className="formControl mb-4 flex justify-center">
                    {hideAdd ?
                        <button id="addEntry" className="bg-yellow-400 p-2 me-2 rounded-xl font-bold hover:bg-yellow-500" onClick={() => swapForm("addForm")}>Add Entry</button> :
                        <button id="closeAdd" className="text-white bg-blue-500 p-2 me-2 rounded-xl font-bold hover:bg-blue-700" onClick={() => setHideAdd(true)}>Close Add</button>}
                    {hideDelete ?
                        <button id="delEntry" className="bg-yellow-400 p-2 ms-2 rounded-xl font-bold hover:bg-yellow-500" onClick={() => swapForm("delForm")}>Delete Entry</button> :
                        <button id="delEntry" className="text-white bg-blue-500 p-2 ms-2 rounded-xl font-bold hover:bg-blue-700" onClick={() => setHideDelete(true)}>Close Delete</button>}
                </div>
                <div className={'flex justify-center'}>
                    <form id="addForm" className="bg-yellow-400/25 p-4 rounded-xl mt-2" hidden={hideAdd}>
                        <div className="sectionHeader">
                            <h4 className={'font-bold text-xl pb-1'}>Add Entry Form</h4>
                        </div>

                        <label htmlFor="compInfo">1. Enter the Name and Year of the Competition:</label><br/>
                        <p className={'ms-3'}>(ex. Competition Classic 2025)</p>
                        <input type="text" id="compInfo" className="mt-1 mb-4 ms-3 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name="compInfo" value={compInfo} onChange={ (e) => setCompInfo(e.target.value) }/><br/>

                        <label>2. Select the Level Competed:</label><br/>
                        <input className="mb-2 ms-4" type="radio" name="level" id="bronze" value="Bronze" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="ps-1 mb-2" htmlFor="bronze">Bronze</label>
                        <input className="mb-2 ms-2" type="radio" name="level" id="silver" value="Silver" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="ps-1 mb-2" htmlFor="silver">Silver</label>
                        <input className="mb-2 ms-2" type="radio" name="level" id="gold" value="Gold" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="ps-1 mb-2" htmlFor="gold">Gold</label><br/>
                        <input className="mb-4 ms-4" type="radio" name="level" id="platinum" value="Platinum" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="ps-1 mb-4" htmlFor="platinum">Platinum</label>
                        <input className="mb-4 ms-2" type="radio" name="level" id="diamond" value="Diamond" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="ps-1 mb-4" htmlFor="diamond">Diamond</label>
                        <input className="mb-4 ms-2" type="radio" name="level" id="sapphire" value="Sapphire" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="ps-1 mb-4" htmlFor="sapphire">Sapphire</label>
                        <br/>

                        <label>3. Enter the Four Individual Event Scores:</label><br/>
                        <p className={'ms-3'}>(can have up to three decimal points, ex. 9.125)</p>
                        <div className="scores">
                            <label className="ms-2 mb-5 me-1" htmlFor="vaultScore">Vault:</label>
                            <input className="mt-1 mb-1 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6] me-2" type="number" id="vaultScore" name="vaultScore" min="0" max="10" value={vaultScore} onChange={ (e) => setVaultScore(e.target.value) }/>

                            <label className="ms-2 mb-3 me-1" htmlFor="barScore">Bars:</label>
                            <input className="mt-1 mb-1 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6] me-2" type="number" id="barScore" name="barScore" min="0" max="10" value={barScore} onChange={ (e) => setBarScore(e.target.value) }/><br/>

                            <label className="ms-2 mb-3 me-1" htmlFor="beamScore">Beam:</label>
                            <input className="mt-1 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6] me-2" type="number" id="beamScore" name="beamScore" min="0" max="10" value={beamScore} onChange={ (e) => setBeamScore(e.target.value) }/>

                            <label className="ms-2 mb-3 me-1" htmlFor="floorScore">Floor:</label>
                            <input className="mt-1 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6] me-2" type="number" id="floorScore" name="floorScore" min="0" max="10" value={floorScore} onChange={ (e) => setFloorScore(e.target.value) }/><br/>
                        </div>

                        <br/>
                        <button id="addSubmit" type="submit" className="me-2 p-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={addEntry}>Submit</button>
                        <button id="clearForm" className="bg-yellow-400 p-2 rounded-xl font-bold hover:bg-yellow-500" onClick={clearForm}>Clear</button>
                    </form>
                </div>

                <div className={'flex justify-center'}>
                    <form id="delForm" className="bg-yellow-400/25 p-4 rounded-xl mt-2" hidden={hideDelete}>
                        <div className="sectionHeader">
                            <h4 className={'font-bold text-xl pb-1'}>Delete Entry Form</h4>
                        </div>

                        <label htmlFor="toDel">Enter the Number(#) of the Entry You Would Like to Delete<br/>(Entry number can be
                            found in the first column of the table below)</label><br/>
                        <input type="number" id="toDel" className="mt-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name="toDel" min="1" value={id} onChange={ (e) => setId(e.target.value) }/><br/>

                        <button id="delSubmit" type="submit" className="mt-4 p-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={delEntry}>Delete</button>
                    </form>
                </div>

                <div className={'flex justify-center'}>
                    <form id="editForm" className="bg-yellow-400/25 p-4 rounded-xl mt-2" hidden={hideEdit}>
                        <div className="sectionHeader mb-3">
                            <h4 className={'font-bold text-xl pb-1'}>Edit Entry Form</h4>
                            <p>Update fields below and save to edit entry.</p>
                        </div>

                        <label htmlFor="num">Entry Number (Display Only, Cannot Edit)</label><br/>
                        <input type="number" id="num" className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name="num" value={id} readOnly/><br/>

                        <label htmlFor="editComp">Name and Year of the Competition:</label><br/>
                        <input type="text" id="editComp" className="mt-1 mb-4 ms-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" name="editComp" value={compInfo} onChange={ (e) => setCompInfo(e.target.value) }/><br/>

                        <label>Level Competed:</label><br/>
                        <input className="form-check-input mb-1 ms-2" type="radio" name="editLevel" id="editBronze" value="Bronze" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="form-check-label ps-1 mb-1" htmlFor="editBronze">Bronze</label>
                        <input className="form-check-input mb-1 ms-2" type="radio" name="editLevel" id="editSilver" value="Silver" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="form-check-label ps-1 mb-1" htmlFor="editSilver">Silver</label>
                        <input className="form-check-input mb-1 ms-2" type="radio" name="editLevel" id="editGold" value="Gold" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="form-check-label ps-1 mb-1" htmlFor="editGold">Gold</label><br/>
                        <input className="form-check-input mb-4 ms-2" type="radio" name="editLevel" id="editPlatinum" value="Platinum" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="form-check-label ps-1 mb-4" htmlFor="editPlatinum">Platinum</label>
                        <input className="form-check-input mb-4 ms-4" type="radio" name="editLevel" id="editDiamond" value="Diamond" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="form-check-label ps-1 mb-4" htmlFor="editDiamond">Diamond</label>
                        <input className="mb-4 ms-2" type="radio" name="level" id="editSapphire" value="Sapphire" onChange={ (e) => setLevel(e.target.value) }/>
                        <label className="ps-1 mb-4" htmlFor="sapphire">Sapphire</label>
                        <br/>

                        <label>Scores:</label><br/>
                        <div className="scores">
                            <label className="ms-2 mb-3 me-1" htmlFor="editVault">Vault:</label>
                            <input className="mt-1 mb-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" type="number" id="editVault" name="vaultScore" min="0" max="10" value={vaultScore} onChange={ (e) => setVaultScore(e.target.value) }/>

                            <label className="ms-2 mb-3 me-1" htmlFor="editBars">Bars:</label>
                            <input className="mt-1 mb-2 border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]" type="number" id="editBars" name="barScore" min="0" max="10" value={barScore} onChange={ (e) => setBarScore(e.target.value) }/><br/>

                            <label className="ms-2 mb-3 me-1" htmlFor="editBeam">Beam:</label>
                            <input className={'border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]'} type="number" id="editBeam" name="beamScore" min="0" max="10" value={beamScore} onChange={ (e) => setBeamScore(e.target.value) }/>

                            <label className="ms-2 mb-3 me-1" htmlFor="editFloor">Floor:</label>
                            <input className={'border-1 rounded-md p-1 bg-yellow-50 focus:outline-[#001CB6]'} type="number" id="editFloor" name="floorScore" min="0" max="10" value={floorScore} onChange={ (e) => setFloorScore(e.target.value) }/><br/>
                        </div>

                        <button id="editSubmit" type="submit" className="mt-4 me-2 p-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-700" onClick={editEntry}>Save</button>
                        <button id={'closeEdit'} className={'mt-4 bg-yellow-400 p-2 rounded-xl font-bold hover:bg-yellow-500'} onClick={() => setHideEdit(true)}>Close</button>
                    </form>
                </div>

                <div id="entries">
                    <div className="sectionHeader pt-5">
                        <h4 className={'font-bold text-xl'}>Entry Table</h4>
                    </div>

                    <div className="pt-3 pb-5 flex-col w-full">
                        <StripedDataGrid
                            getRowHeight={() => 'auto'}
                            rows={rows}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    },
                                },
                            }}
                            pageSizeOptions={[5, 10, 20]}
                            getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                            }
                            sx={{
                                '& .MuiDataGrid-main': {
                                    width: 'fit-content',
                                },
                            }}
                        />
                    </div>
                </div>
            </section>

            <aside className={'flex-c ps-5 ms-10'}>
                <h3 className={'text-2xl font-bold mb-3 text-center'}>Analytics</h3>

                <div className={'flex'}>
                    <div className={'flex-c me-8'}>
                        <h4 className={'mx-2 text-xl font-bold'}>Average:</h4>
                        <div className={'bg-[#fcc800]/25 p-2 mx-1 mb-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Vault Score</h4>
                            <p className={'text-center text-2xl'}>{avgVault}</p>
                        </div>

                        <div className={'bg-[#c8b640]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Bars Score</h4>
                            <p className={'text-center text-2xl'}>{avgBar}</p>
                        </div>

                        <div className={'bg-[#94a480]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Beam Score</h4>
                            <p className={'text-center text-2xl'}>{avgBeam}</p>
                        </div>

                        <div className={'bg-[#6092c0]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Floor Score</h4>
                            <p className={'text-center text-2xl'}>{avgFloor}</p>
                        </div>

                        <div className={'bg-[#2b7fff]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Total Score:</h4>
                            <p className={'text-center text-2xl'}>{avgTotal}</p>
                        </div>
                    </div>

                    <div className={'me-8'}>
                        <img src="src/assets/table.png" className="max-h-[90px] mt-8" alt="Vault Table Icon" />
                        <img src="src/assets/bars.png" className="max-h-[90px] mt-3" alt="Bars Icon" />
                        <img src="src/assets/beam.png" className="max-h-[90px] mt-1" alt="Beam Icon" />
                        <img src="src/assets/floor.png" className="max-h-[75px] ms-1.5 mt-3" alt="Floor Icon" />
                        <img src="src/assets/medal.png" className="max-h-[80px] ms-1.5 mt-5" alt="Medal Icon" />
                    </div>

                    <div className={'flex-c'}>
                        <h4 className={'mx-2 text-xl font-bold text-end'}>Average:</h4>
                        <div className={'bg-[#fcc800]/25 p-2 mx-1 mb-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Vault Score</h4>
                            <p className={'text-center text-2xl'}>{topVault}</p>
                        </div>

                        <div className={'bg-[#c8b640]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Bars Score</h4>
                            <p className={'text-center text-2xl'}>{topBars}</p>
                        </div>

                        <div className={'bg-[#94a480]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Beam Score</h4>
                            <p className={'text-center text-2xl'}>{topBeam}</p>
                        </div>

                        <div className={'bg-[#6092c0]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Floor Score</h4>
                            <p className={'text-center text-2xl'}>{topFloor}</p>
                        </div>

                        <div className={'bg-[#2b7fff]/25 p-2 mx-1 my-3 rounded-xl'}>
                            <h4 className={'text-center font-bold text-xl'}>Total Score:</h4>
                            <p className={'text-center text-2xl'}>{topTotal}</p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </main>;
}

export default App
