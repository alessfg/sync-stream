/* global io, React, ReactDOM, ReactBootstrap */
'use strict';

var Col = ReactBootstrap.Col,
		Row = ReactBootstrap.Row,
		Grid = ReactBootstrap.Grid,
		Navbar = ReactBootstrap.Navbar,
		Nav = ReactBootstrap.Nav,
		NavItem = ReactBootstrap.NavItem;

// var socket = io.connect();

socket.on('console', function(body) {
	console.log(body);
});
/*
var Video = React.createClass({
	getInitialState() {
		var url = window.location.href;
	    return {url: url.substring(url.lastIndexOf('/')+1), player: "" };
	},
	createPlayer() {
	    this.state.player = new YT.Player('player', {
	        height: '390',
	        width: '640',
	        videoId: {this.state.url},
	        events: {
	            'onReady':  this.onPlayerReady,
	            'onStateChange': this.onPlayerStateChange
	        }
	    });
	},
	onPlayerStateChange(event) {
	    var status = this.state.player.getPlayerState();
	    this.state.history.shift();
	    this.state.history.push(status);
	    var time = player.getCurrentTime();
	    if (event.data == YT.PlayerState.PLAYING) {
	        console.log('emit video:play', this.state.history);
	        socket.emit('video:play', time);
	        if (this.state.history.indexOf(3) != -1 && this.state.history.indexOf(-1) == -1) {
	            setTimeout(function() {
	                console.log("delayed emit");
	                socket.emit('video:play', time);
	            }, 600);
	        }
	    }
	    else if (event.data = YT.PlayerState.PAUSED) {
	        console.log('emit video:pause', this.state.history);
	        socket.emit('video:pause', time);
	    } 
	    return event.data;
	},
	resumePlayer() {
	    player.playVideo();
	},
	pausePlayer() {
	    player.pauseVideo();
	},
	onPlayerReady(event) {
	    event.target.playVideo();
	},
	componentDidMount() {
		this.init();
		socket.on('video:pause', function(time) {
		    this.pausePlayer();
		    this.state.player.seekTo(time, true);
		    console.log('get video:pause', this.state.history);
		});
		socket.on('video:play', function(time) {
		    this.resumePlayer();
		    this.state.player.seekTo(time, true);
		    console.log('get video:play', this.state.history);
		});
	},
	init() {
		var tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		this.createPlayer(); 
		return false;
	},
	changeHandler(e) {
		this.setState({url: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		var url = this.state.url.trim();
		if (!url) {
			return;
		}
		this.props.onURLSubmit({url: url});
		this.setState({url: url});
	},
	render() {
		<form onSubmit={this.handleSubmit}>
		    <input 
		    	id="youtubeID" 
		    	type="text" 
		    	value={this.state.url} 
		    	onChange={this.changeHandler} 
		    />
		    <button id="submit">Search ID</button>
		</form>
	}
});
*/
var UsersList = React.createClass({
	render() {
		return (
			<ul className="list-group" id="contact-list">
					{
						this.props.users.map((user, i) => {
							return (
							    <li style={{listStyleType: 'none'}} key={i}>
                    				<div className="col-xs-12 col-sm-9">
											<span className="name">
												{user}
											</span>
											<br/>
									</div>	
								</li>	
							);
						})
					}			
			</ul>
		);
	}
});

var Message = React.createClass({
	render() {
		return (
			<li className="clearfix" style={{borderBottom: '1px dotted #B3A9A9'}}>
                <div className="chat-body clearfix">
                	<strong style={{color: 'red'}} >{this.props.user}</strong>:
                    <span> {this.props.text}</span>
				</div>
			</li>
		);
	}
});

var MessageList = React.createClass({
	render() {
		return (
			<div className="panel panel-primary">
                <div className="panel-body">
                    <ul className="chat" style={{margin: 0, padding: 0}}>
					{
						this.props.messages.map((message, i) => {
							return (
								<Message
									key={i}
									user={message.user}
									text={message.text} 
								/>
							);
						})
					} 
					</ul>
				</div>
			</div>
		);
	}
});

var MessageForm = React.createClass({

	getInitialState() {
		return {text: ''};
	},

	handleSubmit(e) {
		e.preventDefault();
		var message = {
			user : this.props.user,
			text : this.state.text
		}
		this.props.onMessageSubmit(message);	
		this.setState({ text: '' });
	},

	changeHandler(e) {
		this.setState({ text : e.target.value });
	},

	render() {
		return(
			<div className="panel-footer">
                <div className="input-group">
                <h5> Send Message </h5>
					<form onSubmit={this.handleSubmit}>
						<input 
							id="btn-input" 
							type="text" 
							value={this.state.text}
							onChange={this.changeHandler} 
							className="form-control input-sm" 
							placeholder="Type message here..." 
						/>
					</form>
				</div>
			</div>
		);
	}
});

var ChangeNameForm = React.createClass({
	getInitialState() {
		return {newName: ''};
	},

	onKey(e) {
		this.setState({ newName : e.target.value });
	},

	handleSubmit(e) {
		e.preventDefault();
		var newName = this.state.newName;
		this.props.onChangeName(newName);	
		this.setState({ newName: '' });
	},

	render() {
		return(
			<div className='change_name_form'>
				<h5> Change Name </h5>
				<form onSubmit={this.handleSubmit}>
					<input
						id="btn-input" 
						type="text" 
						onChange={this.onKey}
						className="form-control input-sm" 
						value={this.state.newName} 
						placeholder="Enter new name..."
					/>
				</form>	
			</div>
		);
	}
});


var ChatApp = React.createClass({

	getInitialState() {
		return {users: [], messages:[], text: ''};
	},

	componentDidMount() {
		socket.emit('init');
		socket.on('init', this._initialize);
		socket.on('send:message', this._messageRecieve);
		socket.on('user:join', this._userJoined);
		socket.on('user:left', this._userLeft);
		socket.on('change:name', this._userChangedName);
	},

	_initialize(data) {
		console.log("_initialize");
		var {users, name} = data;
		this.setState({users: data.users, user: name});
	},

	_messageRecieve(message) {
		console.log("_messageRecieve");
		var {messages} = this.state;
		messages.push(message);
		this.setState({messages});
	},

	_userJoined(data) {
		console.log("userJoined");
		var {users, messages} = this.state;
		var {name} = data;
		users.push(name);
		messages.push({
			user: 'APPLICATION BOT',
			text : name +' Joined'
		});
		this.setState({users, messages});
	},

	_userLeft(data) {
		console.log("_userLeft");
		var {users, messages} = this.state;
		var {name} = data;
		var index = users.indexOf(name);
		users.splice(index, 1);
		messages.push({
			user: 'APPLICATION BOT',
			text : name +' Left'
		});
		this.setState({users, messages});
	},

	_userChangedName(data) {
		console.log("_userChangedName");
		var {oldName, newName} = data;
		var {users, messages} = this.state;
		var index = users.indexOf(oldName);
		users.splice(index, 1, newName);
		messages.push({
			user: 'APPLICATION BOT',
			text : 'Change Name : ' + oldName + ' ==> '+ newName
		});
		this.setState({users, messages});
	},

	handleMessageSubmit(message) {
		console.log("_handleMessageSubmit");
		var {messages} = this.state;
		messages.push(message);
		this.setState({messages});
		socket.emit('send:message', message);
	},

	handleChangeName(newName) {
		console.log("_handleChangeName");
		var oldName = this.state.user;
		socket.emit('change:name', { name : newName}, (result) => {
			if(!result) {
				return alert('There was an error changing your name');
			}
			var {users} = this.state;
			var index = users.indexOf(oldName);
			users.splice(index, 1, newName);
			this.setState({users, user: newName});
		});
	},

	render() {
		return (
			<div>
				<Grid>
					<Row>
		        		<Col md={3}>
							<UsersList
								users={this.state.users}
							/>
						</Col>
						<div className="col-md-6">
				            <div className="embed-responsive embed-responsive-16by9">
				                <div id="player"></div>
				            </div>
				        </div>
						<Col md={3}>
							<MessageList
								messages={this.state.messages}
							/>
						</Col>
					</Row>
					<Row>
						<Col md={3}>
							<ChangeNameForm
								onChangeName={this.handleChangeName}
							/>
						</Col>
						<Col md={6}>
							<br />
							
							<div id="search_bar"></div>
						</Col>
						<Col md={3}>
							<MessageForm
								onMessageSubmit={this.handleMessageSubmit}
								user={this.state.user}
							/>
						</Col>
						
					</Row>
				</Grid>
			</div>
		);
	}
});

ReactDOM.render(<ChatApp />, document.getElementById('app'));
