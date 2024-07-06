import { Component } from 'react'
import ReactPlayer from 'react-player';
import TrackFrame from '../components/TrackFrame/TrackFrame';
import { SearchBtns, SearchResults } from '../components/gsearch-components';
import { List } from '../components/List';
import * as defs from '../res/defs';
import handleMultipleURLs from '../res/fetch-titles';
import IDBPlaylistConnection from '../res/idb';
import { ManageSection, Overlay } from '../components/popup-sections/popup-sections';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            frameTrackID: null,
            frameMedia: null,
            frameURL: null,
            frameFileName: null,
            list: [],
            playing: true,
            searchResults: [],
            resultsDisplay: "none",
            resultsMedia: null,
            inputView: "text",
            mgmtDisplay: "none",
            overlayDisplay: "none",
            autoplayFlag: true
        };
        this.idbConn = new IDBPlaylistConnection();
    }

    componentDidMount() {
        let retrievedList = [];
        const retrievePromise = new Promise(resolve => {
            retrievedList = this.idbConn.retrieveListFromIDB('playlist00', false);;
            resolve(retrievedList);
        });
        retrievePromise.then(retrievedList => {
            if(retrievedList.length == 0) retrievedList = this.state.list;

            // Remove duplicates
            retrievedList = retrievedList.reduce((acc, curr) => {
                return acc.includes(curr)
                    ? acc
                    : [...acc, curr];
                }, []);

            this.setState({
                ...this.state,
                list: retrievedList,
                frameMedia: retrievedList[0].media,
                frameURL: retrievedList[0].trackUrl,
                frameFileName: retrievedList[0].fileName
            });
            defs.outlineItem(this.state.frameTrackID);
            handleMultipleURLs();
        });
        this.attachSpaceKeyEventHandler();
    }
    componentDidUpdate(_, prevState) {
        defs.outlineItem(this.state.frameTrackID);
        handleMultipleURLs();
        if(this.state.list != prevState.list) {
            this.idbConn.savePlaylistAsDefault(this.state.list);
        }
    }
    updateFrameProps = (index) => {
        const trackObject = this.state.list[index];
        this.setState({
            ...this.state,
            frameTrackID: index,
            frameMedia: trackObject.media,
            frameURL: trackObject.trackUrl,
            frameFileName: trackObject.fileName
        });
    }

    handleSpaceKeyEvent = (event) => {
        if(event.code == 'Space') this.togglePlayingState();
    }
    attachSpaceKeyEventHandler = () => {
        window.addEventListener('keydown', this.handleSpaceKeyEvent);
    }
    removeSpaceKeyHandler = () => {
        window.removeEventListener('keydown', this.handleSpaceKeyEvent);
    }

    submitTrack = () => {
        if(this.state.list.length > 49) {
            alert("Plejlista może zawierać maksymalnie 50 utworów!");
            return false;
        }
        if(this.state.inputView == 'file') {
            this.submitAudioTracks();
            return;
        }
        const inputLink = document.getElementById('link-input').value;
        let linkToSubmit;
        if(ReactPlayer.canPlay(inputLink) 
            || defs.validateSpotifyUrl(inputLink) 
            || defs.validateGoogleDriveUrl(inputLink)) {

            linkToSubmit = inputLink;
            const medium = defs.detectMedium(linkToSubmit, defs.availableMedia);
            const trackObject = {
                id: (this.state.list.length + 1).toString(),
                media: medium,
                trackUrl: linkToSubmit,
                fileName: null
            }
            const updatedList = [...this.state.list, trackObject];
            this.setState({
                ...this.state,
                list: updatedList
            });
            if(updatedList.length == 1) this.updateFrameProps(0);

        } else alert(`Nieprawidłowy format linku! Pod przyciskiem "jak to działa?" znajdziesz wytyczne dot. formatów.`);

        document.getElementById('link-input').value = null;
    }

    addTrack = (item, media) => {
        if(this.state.list.length > 49) {
            alert("Plejlista może zawierać maksymalnie 50 utworów!");
            return false;
        }
        const trackObject = {
            id: (this.state.list.length + 1).toString(),
            media: media == 'YouTube' ? media : media.toLowerCase(),
            trackUrl: item.link,
            fileName: null
        }
        const updatedList = [...this.state.list, trackObject];
        console.log(updatedList);
        this.setState({
            ...this.state,
            list: updatedList
        });
        if(updatedList.length == 1) this.updateFrameProps(0);
    }

    toggleFileInput = () => {
        const viewToSet = this.state.inputView == 'text'
                    ? 'file'
                    : 'text'
        this.setState({
            ...this.state,
            inputView: viewToSet
        });
    }

    submitAudioTracks = () => {
        const inputData = document.getElementById('file-input');
        const lng = this.state.list.length;
        let audioFiles = [...inputData.files].map((item, index) => {
            return {
                id: (lng + index + 1).toString(),
                media: 'plik audio',
                trackUrl: item,
                fileName: item.name.split('.')[0]
            }
        });
        const updatedList = [...this.state.list, ...audioFiles];
        console.log(updatedList);
        this.setState({
            ...this.state,
            list: updatedList,
            inputView: 'text',
            frameTrackID: lng == 0 ? 0 : this.state.frameTrackID
        });
        inputData.value = null;
    }

    prevTrack = () => {
        const index = this.state.frameTrackID;
        if(index <= 0) {
            return false;
        } else {
            this.setState({
                ...this.state,
                frameTrackID: index - 1,
                autoplayFlag: true
            });
            return true;
        }
    }
    nextTrack = () => {
        const index = this.state.frameTrackID;
        if(index >= this.state.list.length - 1) {
            return false;
        } else {
            this.setState({
                ...this.state,
                frameTrackID: index + 1,
                autoplayFlag: true
            });
            return true;
        }
    }
    
    handlePlayerError = () => {
        alert("Błąd odtwarzacza. Załadowano następny utwór.");
        setTimeout(this.nextTrack, 2000);
    }

    togglePlayingState = () => {
        const frameMedia = this.state.list[this.state.frameTrackID].media;
        let playingState = this.state.playing;
        if(frameMedia == 'spotify') {
            playingState = true;
        } else {
            playingState = !playingState;
        }
        this.setState({
            ...this.state,
            playing: playingState,
            autoplayFlag: true
        });
        defs.togglePauseBtn(playingState, frameMedia);
    }

    playFromList = (item) => {
        const itemIndex = this.state.list.indexOf(item);
        this.setState({
            ...this.state,
            frameTrackID: itemIndex,
            autoplayFlag: true
        });
    }
    deleteItem = (item) => {
        const list = this.state.list;
        if(this.state.list.length == 1) {
            this.setState({
                ...this.state,
                list: [],
                frameTrackID: null
            });
            return;
        }
        const concatted = list.slice(0, list.indexOf(item))
                            .concat(list.slice(list.indexOf(item) + 1));
        const currID = this.state.frameTrackID;
        this.setState({
            ...this.state,
            list: concatted,
            frameTrackID: list.indexOf(item) < currID ? currID - 1 : currID,
            autoplayFlag: false 
        });
    }

    shuffleList = () => {
        const shuffledList = [...this.state.list].sort(() => Math.random() - 0.5);
        const IDtoOutline = this.state.frameTrackID == 0 ? 1 : 0;
        this.setState({
            ...this.state,
            list: shuffledList,
            frameTrackID: null
        });
        defs.outlineItem(IDtoOutline);
    }
    
    handleDragEnd = ({ destination, source }) => {
        if (!destination) return;
        const reorderedList = defs.reorder(this.state.list, source.index, destination.index);
        this.setState({
            ...this.state,
            list: reorderedList,
            autoplayFlag: false
        });
    }

    closeWindow = (elementId) => {
        const propName = elementId + "Display";
        this.setState({
            [propName]: "none",
            overlayDisplay: "none",
            playing: this.state.playing
        });
    }

    performSearch = (item) => {
        const inputValue = document.querySelector('#link-input').value;
        if(!inputValue || inputValue == '') return false;

        let searchQuery =  inputValue + " " + item;
        let fetchedResults = [];
        if(item == 'Spotify') searchQuery = searchQuery + " track";

        const resultPromise = new Promise((resolve, reject) => {
           fetchedResults = defs.fetchGoogleResults(searchQuery);
           resolve(fetchedResults);
        });
        resultPromise.then(fetchedResults => {
            this.setState({
                ...this.state,
                searchResults: fetchedResults,
                resultsDisplay: "block",
                resultsMedia: item,
                playing: this.state.playing,
                autoplayFlag: false
            })
        });
        document.querySelector('#link-input').value = null;
    }

    loadListFromIDB = (loadedList) => {
        this.setState({ list: loadedList });
    }

    toggleExportBtns = (val) => {
        const exportBtns = document.querySelectorAll('.dropdown ~ ul li');
        [...exportBtns].forEach((item) => {
            item.className = 'page-item ' + val;
        });
    }

    generateHashLink = () => {
        alert("Niebawem ;)");
        return false;
    }
    exportToFolder = async () => {
        try {
            await this.idbConn.saveAudioFilesToFolder();
        } catch(error) {
            console.log(error);
        }
    }

    showMgmtWindow = () => {
        this.setState({
            ...this.state,
            mgmtDisplay: "block",
            overlayDisplay: "block",
            playing: this.state.playing,
            autoplayFlag: false
        });
    }

    render() {
        const list = this.state.list;
        const frameMedia = this.state.frameMedia;
        const searchResultsClass = this.state.resultsDisplay + " results-" + frameMedia;
        const listClass = "column list-" + frameMedia;
        const trackNavClass = "track-nav track-nav-" + frameMedia;
        const mgmtClass = this.state.mgmtDisplay + " mgmt-fit-" + frameMedia;

        return (
            <div id="container">
                <form id="track-form" onSubmit={(event) => event.preventDefault()}>
                    <input id="link-input" type="search" name="gsearch" 
                            placeholder="wyszukaj lub wklej url"
                            onFocus={this.removeSpaceKeyHandler}
                            onBlur={this.attachSpaceKeyEventHandler}
                            className={this.state.inputView == 'text' ? "" : "link-input-hidden"}
                            />
                    <input id="file-input" type="file" name="audio" accept=".mp3, .wav" multiple
                        className={this.state.inputView == 'file' ? "file-input-visible" : "file-input"}
                        />
                    <button onClick={this.submitTrack}>
                        {this.state.inputView == 'text' ? 'dodaj url' : 'dodaj'}
                    </button>
                    <button onClick={this.toggleFileInput}>
                        {this.state.inputView == 'text' ? 'plik audio' : 'wróć'}
                        </button>
                    <SearchBtns fName={this.performSearch}/>
                </form>

                <section id="special-buttons" 
                    onMouseLeave={() => this.toggleExportBtns('hidden-btns')}>
                    <ul>
                        <li className='page-item'>
                            <button className='page-link'
                                onClick={this.showMgmtWindow}>zarządzaj plejlistami
                            </button>
                        </li>
                        <li className='page-item'>
                            <button className='page-link dropdown'
                                onMouseEnter={() => this.toggleExportBtns('hovered')}
                            >eksportuj plejlistę
                            </button>
                            <ul className='hidden-list'>
                                <li className='page-item hidden-btns'>
                                    <button id="folder-btn" className='page-link dd-btn'
                                        onClick={this.exportToFolder}>do folderu
                                    </button>
                                </li>
                                <li className='page-item hidden-btns'>
                                    <button id="export-btn" className='page-link dd-btn'
                                        onClick={this.generateHashLink}>do linku
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <div className="row">
                    <div className="column transport">
                        <section id="player"
                            className="x">
                            <TrackFrame  media={frameMedia}
                                     url={this.state.frameURL} 
                                     playing={this.state.playing}
                                     onEnded={this.nextTrack}
                                     onError={this.handlePlayerError}
                                     autoplayFlag={this.state.autoplayFlag}  
                            />
                        </section>
                        <section id="track-nav" className={trackNavClass}>
                            <button className="nav-btn previous-btn" onClick={this.prevTrack}>
                                <i className="arrow left"></i>
                            </button>
                            <button id="pause-btn" onClick={this.togglePlayingState}
                                className="playing-true">II</button>
                            <button className="nav-btn next-btn" onClick={this.nextTrack}>
                                <i className="arrow right"></i>
                            </button>
                            <button id="shuffle-btn"
                                className="shuffle-btn" 
                                onClick={this.shuffleList}>shuffle</button>
                        </section>
                    </div>

                    <div className={listClass}>
                        <List  list={list}
                            onDragEnd={this.handleDragEnd}
                            playFunction={this.playFromList}
                            deleteFunction={this.deleteItem}
                        />
                    </div>

                </div>

                <section id="results" className={searchResultsClass}>
                    <button className="close-search" onClick={() => this.closeWindow("results")}>X</button>
                    <SearchResults results={this.state.searchResults}
                        media={this.state.resultsMedia}
                        addTrack={this.addTrack}
                    />
                </section>

                <section id="mgmt" className={mgmtClass}>
                    <button className="close-search" onClick={() => this.closeWindow("mgmt")}>X</button>
                    <ManageSection
                        list={this.state.list}
                        onDataFetch={this.loadListFromIDB}
                        onClose={() => this.closeWindow("mgmt")}
                    />
                </section>

                <Overlay display={this.state.overlayDisplay}/>

            </div>
        );
    }
}