    var video, context, imageData, detector, posit;
    var renderer1, renderer2, renderer3;
    var scene1, scene2, scene3, scene4;
    var camera1, camera2, camera3, camera4;
    var plane1, plane2, model, texture1, texture2;
    var step = 0.0;

    var videoSelect;
    var modelSize = 35.0; //millimeters

    function onLoad(){
      videoSelect = document.getElementById("videoSource");
      if (typeof MediaStreamTrack === 'undefined'){
        alert('This browser does not support MediaStreamTrack.\n\nTry Chrome Canary.');
      } else {
        MediaStreamTrack.getSources(gotSources);
      }
      video = document.getElementById("video");
    };

    function gotSources(sourceInfos) {
      for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        var option = document.createElement("option");
        option.value = sourceInfo.id;
        if (sourceInfo.kind === 'video') {
          option.text = sourceInfo.label || 'camera ' + (videoSelect.length + 1);
          videoSelect.appendChild(option);
        } else {
          console.log('Some other kind of source: ', sourceInfo);
        }
      }
      videoSelect.onchange = start;
      start();
    }
    

    function start(){

      if (!!window.stream) {
        video.src = null;
        window.stream.stop();
      }
      
      var videoSource = videoSelect.value;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (navigator.getUserMedia){
        navigator.getUserMedia(
          {
            video:{
              optional:[{sourceId:videoSource}]
            }
          },
          function (stream){
            window.stream = stream;
            if (window.webkitURL) {
              video.src = window.webkitURL.createObjectURL(stream);
            } else if (video.mozSrcObject !== undefined) {
              video.mozSrcObject = stream;
            } else {
              video.src = stream;
            }
            video.play();
          },
          function(error){
          }
        );
        
        if (!renderer3) {
          createRenderers();
          createScenes();
        }
        requestAnimationFrame(tick);
      }
    };

    function tick(){
      requestAnimationFrame(tick);
     
      if (video.readyState === video.HAVE_ENOUGH_DATA){
        render();
      }
    };


    function createRenderers(){
      renderer3 = new THREE.WebGLRenderer();
      renderer3.setClearColorHex(0xffffff, 1);
      renderer3.setSize(320, 240);
      document.getElementById("container").appendChild(renderer3.domElement);
      
      render1 = new THREE.WebGLRenderer();
      render1.setClearColorHex(0xffffff, 1);
      render1.setSize(320, 240);
      document.getElementById("container2").appendChild(render1.domElement);
     
      scene3 = new THREE.Scene();
      camera3 = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5);
      scene3.add(camera3);
      
      scene1 = new THREE.Scene();
      camera1 = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5);
      scene1.add(camera1);
    };

    function render(){
	    texture1.children[0].material.map.needsUpdate = true;       
      renderer3.autoClear = false;
      renderer3.clear();
      renderer3.render(scene3, camera3);
      
	    texture2.children[0].material.map.needsUpdate = true;       
      render1.autoClear = false;
      render1.clear();
      render1.render(scene1, camera1);
    };

    function createScenes(){
      texture1 = createTexture();
      texture1.position.x = 0.05;
      scene3.add(texture1);
      texture2 = createTexture();
      texture2.position.x = -0.05
      scene1.add(texture2);
    };
  
    function createTexture(){
      var texture = new THREE.Texture(video),
          object = new THREE.Object3D(),
          geometry = new THREE.PlaneGeometry(1.0, 1.0, 0.0),
          material = new THREE.MeshBasicMaterial( {map: texture, depthTest: false, depthWrite: false} ),
          mesh = new THREE.Mesh(geometry, material);
     
      object.position.z = -1;
      object.add(mesh);
     
      return object;
    };
   



    window.onload = onLoad;
