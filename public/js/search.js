/**
 * This file has been created at the facebook London hackathon 12/03/2016
 *
 * It is strictly prohibited to not pay attneiton to details in this file. 
 */



// Search Box
// - - - - - - - - - - - - - - - - - - - - -
var SearchBox = React.createClass({

/**/
	handleUrlSubmit: function(video_data) {
		this.setState({data: video_data});
		console.log(video_data.video_url);

		video_data.id = Date.now();
		console.log(video_data);

		video_data.video_id = getParameterByName('v', video_data.video_url);
		console.log( "video id = ", video_data.video_id);

		var href = window.location.href;
		var href = href.split('/');
		window.location = href[0] + '//' + href[2] + "/vroom=" + video_data.video_id; 
	   //  $.ajax({

	   //  	// data needed 
	   //    	url: this.props.url,
	   //    	dataType: 'json',
	   //    	type: 'POST',
	   //    	data: video_data,

	   //    	// success / failure callbacks
	   //    	success: function(data) {
	   //      	this.setState({data: data});
	        	
				// var href = window.location.href;
				// href = href.replace('video.html','');
				// window.location = href + "vroom=" + video_data.video_id; 
	   //    	}.bind(this),
	   //    	error: function(xhr, status, err) {
	   //      	this.setState({data: video_data});
	   //      	console.error(this.props.url, status, err.toString());
	   //    	}.bind(this)
	   //  });
  	},
	getInitialState: function() {
	    	return {data: [] };
	},

	render: function(){
		return(
			<SearchBar onUrlSubmit = {this.handleUrlSubmit} />
		);
	}
});


// Search function 
// - - - - - - - - - - - - - - - - - - - - -
var SearchBar = React.createClass({

	getInitialState: function() {
		return {video_url: ''};
	},
  	handleUrlChange: function(e) {
    	this.setState({video_url: e.target.value});
  	},
  	handleSubmit: function(e) {
    	e.preventDefault();
    	var video_url = this.state.video_url;
    	if (!video_url ) {
			console.log("empty");
    		return;
    	}

		console.log(video_url);


    	var video_data = {video_url: video_url};
    	this.props.onUrlSubmit( video_data );
    	//this.setState({video_url: ''});
  	},
  	render: function() {
    	return (
    		<div className="row">
    		<div className="col-xs-6 col-xs-offset-3 text-center">
	      		<form className="urlForm" onSubmit={this.handleSubmit}>
	      			<fieldset className="form-group">
		        	<input
		          		type="text"
		          		placeholder="youtube url"
		          		className="form-control"
		          		value={this.state.video_url}
		          		onChange={this.handleUrlChange}
		        	/>
		        	</fieldset>
		        	
		        	<input type="submit" value="Start Session" className="btn btn-primary btn-lg btn-danger"/>
	      		</form>
	      		<Url data={this.state.video_url} />
      		</div>
      		</div>
    	);
  	}


});

/**/
// Url capturer 
// - - - - - - - - - - - - - - - - - - - - -
var Url = React.createClass({

	render: function(){
		return(
			<p> {this.props.data} </p>
		);
	}
});


ReactDOM.render(
  <SearchBox  url="/api/videos"/>,
  document.getElementById('search_bar')
);









