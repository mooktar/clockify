function Button ({ id, handleClick, item, type, children }) {
    return <button 
        id={id} 
        class="btn btn-sm btn-light" 
        onClick={handleClick} 
        data-item={item}
        data-type={type}
    >
        {children}
    </button>
}

function Layout ({ item, state, handleClick }) {
    const itemLabel = item == 'session' ? 'Session Length' : 'Break Length'
    return <div className="col-sm-6">
        <h3 id={item+"-label"} className="text-label">{itemLabel}</h3>
        <Button id={item+"-decrement"} item={item} type="decrement" handleClick={handleClick}>-</Button>
        <span id={item+"-length"} className="item-length">{state}</span>
        <Button id={item+"-increment"} item={item} type="increment" handleClick={handleClick}>+</Button>
    </div>
}

function TimerLayout ({ timeout, toggleTimer, toggleLabel, handleReset, beep, timerType }) {
    const minutes = ('0' + (Math.floor(timeout / 60))).slice(-2)
    const seconds = ('0' + (timeout % 60)).slice(-2)
    return <div className="row mt-4">
        <h3 id="timer-label" className="text-label">{timerType}</h3>
        <div id="time-left" className="time-left">{minutes}:{seconds}</div>
        <div className="btn-controler">
            <Button id="start_stop" item="" handleClick={toggleTimer}>{toggleLabel()}</Button>
            <Button id="reset" item="" handleClick={handleReset}>🔄</Button>
        </div>
        <audio 
            id="beep" 
            preload="auto"
            ref={beep}
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
    </div>
}

const INITIAL_STATE = {
    breakLength: 5,
    sessionLength: 25,
    timeout: 1500,
    timer: null,
    timerType: 'Session'
}

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = INITIAL_STATE
        this.beep = React.createRef()
        this.handleReset = this.handleReset.bind(this)
        this.handleLayout = this.handleLayout.bind(this)
        this.handleTimeout = this.handleTimeout.bind(this)
        this.toggleTimer = this.toggleTimer.bind(this)
        this.toggleLabel = this.toggleLabel.bind(this)
    }

    handleReset () { 
        this.setState(INITIAL_STATE) 
        window.clearInterval(this.state.timer)
        this.beep.current.pause()
        this.beep.current.currentTime = 0
    }

    handleLayout (e) {
        const item = e.target.dataset.item
        const length = this.state[item + "Length"]
        const result = e.target.dataset.type === 'decrement'
            ? length > 1 ? length - 1 : length
            : length < 60 ? length + 1 : length
        this.setState({ [item + "Length"]: result });
        if (item == 'session') {
            this.setState({ timeout: result * 60 });
        }
    }

    handleTimeout () {
        const { breakLength, sessionLength, timeout, timerType } = this.state
        if (timeout > 0) {
            this.setState({ timeout: timeout - 1 })
        } else {
            this.beep.current.play()
            this.setState({ 
                timeout: timerType == 'Session' 
                    ? breakLength * 60 
                    : sessionLength * 60,
                timerType: timerType == 'Session' ? 'Break' : 'Session'
            })
        }
    }

    toggleTimer () {
        const { timer } = this.state
        window.clearInterval(timer)
        if (timer) {
            this.setState({ timer: null })
        } else {
            this.setState({
                timer: window.setInterval(this.handleTimeout.bind(this), 1000)
            })
        }
    }

    toggleLabel () { return this.state.timer ? '⏸' : '▶' }

    render() {
        return (<div className="container text-center">
            <div className="clock-container">
                <h1 className="app-title">25 + 5 Clock</h1>
                <hr className="hr-only bg-secondary" />
                <div className="row">
                    <Layout 
                        item="break" 
                        state={this.state.breakLength} 
                        timeout={this.state.timeout}
                        handleClick={this.handleLayout}
                    />
                    <Layout 
                        item="session" 
                        state={this.state.sessionLength} 
                        handleClick={this.handleLayout}
                    />
                </div>
                <TimerLayout
                    timeout={this.state.timeout}
                    toggleLabel={this.toggleLabel}
                    toggleTimer={this.toggleTimer}
                    handleReset={this.handleReset}
                    beep={this.beep}
                    timerType={this.state.timerType}
                />
            </div>
            <div className="copy">Developed with 💗 by <a href="mailto:mohmouktar@gmail.com">mooktar</a>.</div>
        </div>)
    }
}

ReactDOM.render(<App />, document.querySelector('#app'))