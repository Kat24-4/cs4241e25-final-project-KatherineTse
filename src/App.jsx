import { useState, useEffect } from 'react'


function App() {
// Sends request to server to get data when website is first loaded.
    // Calls function to display data if there is any or sends alter to new user that their account has successfully been created
    useEffect( () => {

        async function loadData() {
            // send Get request asking for data
            const response = await fetch("/api/loadData", {
                method: "GET",
                credentials: 'include'
            })

            // wait for data and then send it to be displayed
            const appdata = await response.text()

            const data = JSON.parse(appdata)

            if (data === "new") {
                alert("New user created with username and password. Welcome!");
            } else {
                setData(data);
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
    const [data, setData] = useState([])

    const [hideAdd, setHideAdd] = useState(true);
    const [hideEdit, setHideEdit] = useState(true);
    const [hideDelete, setHideDelete] = useState(true);

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
            credentials: 'include',
            body
        })

        // wait for response from server
        const appdata = await response.text()

        const data = JSON.parse(appdata)

        // send data sent from server to be displayed and reset the form
        setData(data)
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
            credentials: 'include',
            body
        })

        // wait for response from server
        const appdata = await response.text()

        const data = JSON.parse(appdata)

        // send data sent from server to be displayed and reset the form
        setData(data)
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
        console.log(body)

        const response = await fetch("/api/submit", {
            method: "POST",
            credentials: 'include',
            body
        })

        // wait for response from server
        const appdata = await response.text()

        const data = JSON.parse(appdata)

        // send data sent from server to be displayed, reset the form, swap to AddEntry form
        setData(data)
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
        }
    }

    return <main className="formAndEntries d-flex flex-column">
        <p className="m-auto mb-4 h5"><strong>Welcome to your personal score tracker!</strong> You can add and delete
            competitions by clicking on the buttons below and filling out the forms.<br/>All competitions added will be
            displayed in the table below. The "Edit Entry" button, will open a form that will update entries stored.</p>
        <div className="formControl m-auto mb-4">
            <button id="addEntry" className="btn btn-warning me-2 mt-3" onClick={() => swapForm("addForm")}>Add Entry</button>
            <button id="delEntry" className="btn btn-warning ms-2 mt-3" onClick={() => swapForm("delForm")}>Delete Entry</button>
        </div>
        <form id="addForm" className="m-auto bg-warning bg-opacity-25 p-4 rounded-2" hidden={hideAdd}>
            <div className="sectionHeader">
                <h2>Add Entry Form</h2>
            </div>

            <label htmlFor="compInfo">1. Enter the Name and Year of the Competition: <br/>(ex. Competition Classic 2025)</label><br/>
            <input type="text" id="compInfo" className="mt-1 mb-4 ms-2" name="compInfo" value={compInfo} onChange={ (e) => setCompInfo(e.target.value) }/><br/>

            <label>2. Select the Level Competed:</label><br/>
            <input className="form-check-input mb-1 ms-2" type="radio" name="level" id="bronze" value="Bronze" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-1" htmlFor="bronze">Bronze</label>
            <input className="form-check-input mb-1 ms-2" type="radio" name="level" id="silver" value="Silver" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-1" htmlFor="silver">Silver</label>
            <input className="form-check-input mb-1 ms-2" type="radio" name="level" id="gold" value="Gold" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-1" htmlFor="gold">Gold</label><br/>
            <input className="form-check-input mb-4 ms-4" type="radio" name="level" id="platinum" value="Platinum" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-4" htmlFor="platinum">Platinum</label>
            <input className="form-check-input mb-4 ms-2" type="radio" name="level" id="diamond" value="Diamond" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-4" htmlFor="diamond">Diamond</label>
            <br/>

            <label>3. Enter the Four Individual Event Scores:<br/>(can include up to three decimal points, ex.
                9.125)</label><br/>
            <div className="scores">
                <label className="ms-2 mb-3 me-1" htmlFor="vaultScore">Vault:</label>
                <input className="mt-1" type="number" id="vaultScore" name="vaultScore" min="0" max="10" value={vaultScore} onChange={ (e) => setVaultScore(e.target.value) }/>

                <label className="ms-2 mb-3 me-1" htmlFor="barScore">Bars:</label>
                <input className="mt-1" type="number" id="barScore" name="barScore" min="0" max="10" value={barScore} onChange={ (e) => setBarScore(e.target.value) }/><br/>

                <label className="ms-2 mb-3 me-1" htmlFor="beamScore">Beam:</label>
                <input type="number" id="beamScore" name="beamScore" min="0" max="10" value={beamScore} onChange={ (e) => setBeamScore(e.target.value) }/>

                <label className="ms-2 mb-3 me-1" htmlFor="floorScore">Floor:</label>
                <input type="number" id="floorScore" name="floorScore" min="0" max="10" value={floorScore} onChange={ (e) => setFloorScore(e.target.value) }/><br/>
            </div>

            <br/>
            <button id="addSubmit" type="submit" className="btn btn-primary me-2" onClick={addEntry}>Submit</button>
            <button id="clearForm" className="btn btn-warning" onClick={clearForm}>Clear</button>
        </form>

        <form id="delForm" className="m-auto bg-warning bg-opacity-25 p-4 rounded-2" hidden={hideDelete}>
            <div className="sectionHeader">
                <h2>Delete Entry Form</h2>
            </div>

            <label htmlFor="toDel">Enter the Number(#) of the Entry You Would Like to Delete<br/>(Entry number can be
                found in the first column of the table below)</label><br/>
            <input type="number" id="toDel" className="mt-1 ms-2" name="toDel" min="1" value={id} onChange={ (e) => setId(e.target.value) }/><br/>

            <br/>
            <button id="delSubmit" type="submit" className="btn btn-primary" onClick={delEntry}>Delete</button>
        </form>

        <form id="editForm" className="m-auto bg-warning bg-opacity-25 p-4 rounded-2" hidden={hideEdit}>
            <div className="sectionHeader">
                <h2>Edit Entry Form</h2>
                <p>Update fields below and save to edit entry.</p>
            </div>

            <label htmlFor="num">Entry Number (Display Only, Cannot Edit)</label><br/>
            <input type="number" id="num" className="mt-1 mb-4 ms-2" name="num" value={id} readOnly/><br/>

            <label htmlFor="editComp">Name and Year of the Competition:</label><br/>
            <input type="text" id="editComp" className="mt-1 mb-4 ms-2" name="editComp" value={compInfo} onChange={ (e) => setCompInfo(e.target.value) }/><br/>

            <label>Level Competed:</label><br/>
            <input className="form-check-input mb-1 ms-2" type="radio" name="editLevel" id="editBronze" value="Bronze" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-1" htmlFor="editBronze">Bronze</label>
            <input className="form-check-input mb-1 ms-2" type="radio" name="editLevel" id="editSilver" value="Silver" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-1" htmlFor="editSilver">Silver</label>
            <input className="form-check-input mb-1 ms-2" type="radio" name="editLevel" id="editGold" value="Gold" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-1" htmlFor="editGold">Gold</label><br/>
            <input className="form-check-input mb-4 ms-4" type="radio" name="editLevel" id="editPlatinum" value="Platinum" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-4" htmlFor="editPlatinum">Platinum</label>
            <input className="form-check-input mb-4 ms-4" type="radio" name="editLevel" id="editDiamond" value="Diamond" onChange={ (e) => setLevel(e.target.value) }/>
            <label className="form-check-label ps-1 mb-4" htmlFor="editDiamond">Diamond</label>
            <br/>

            <label>Scores:</label><br/>
            <div className="scores">
                <label className="ms-2 mb-3 me-1" htmlFor="editVault">Vault:</label>
                <input className="mt-1" type="number" id="editVault" name="vaultScore" min="0" max="10" value={vaultScore} onChange={ (e) => setVaultScore(e.target.value) }/>

                <label className="ms-2 mb-3 me-1" htmlFor="editBars">Bars:</label>
                <input className="mt-1" type="number" id="editBars" name="barScore" min="0" max="10" value={barScore} onChange={ (e) => setBarScore(e.target.value) }/><br/>

                <label className="ms-2 mb-3 me-1" htmlFor="editBeam">Beam:</label>
                <input type="number" id="editBeam" name="beamScore" min="0" max="10" value={beamScore} onChange={ (e) => setBeamScore(e.target.value) }/>

                <label className="ms-2 mb-3 me-1" htmlFor="editFloor">Floor:</label>
                <input type="number" id="editFloor" name="floorScore" min="0" max="10" value={floorScore} onChange={ (e) => setFloorScore(e.target.value) }/><br/>
            </div>

            <br/>
            <button id="editSubmit" type="submit" className="btn btn-primary" onClick={editEntry}>Save</button>
        </form>
        <div id="entries">
            <div className="sectionHeader ps-3 pt-5">
                <h2>Competition Entries</h2>
            </div>

            <div className="p-3">
                <table id="dataTable" className="table table-striped table-hover">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Competition Information</th>
                        <th>Level</th>
                        <th>Vault Score</th>
                        <th>Bars Score</th>
                        <th>Beam Score</th>
                        <th>Floor Score</th>
                        <th>Total Score</th>
                        <th>Editable</th>
                    </tr>
                    </thead>
                    <tbody id="storedData" className="table-group-divider">
                    {data.map(item => (
                        <tr key={item.id}>
                            <td className="align-middle">{item.id}</td>
                            <td className="align-middle">{item.compInfo}</td>
                            <td className="align-middle">{item.level}</td>
                            <td className="align-middle">{item.vaultScore}</td>
                            <td className="align-middle">{item.barScore}</td>
                            <td className="align-middle">{item.beamScore}</td>
                            <td className="align-middle">{item.floorScore}</td>
                            <td className="align-middle">{item.totalScore}</td>
                            <td><button className="btn btn-primary" onClick={ () => swapForm("editForm", item) }>Edit Entry</button></td>
                        </tr>
                    ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    </main>;
}

export default App
