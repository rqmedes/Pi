# Pi
Front Single page UI library

/*  Test usage  */
loadResources([{url:'/resources/js/test.js', type:'js', ver: 1}])
.then(function(response) {
    console.log("Success!", response);
}).catch(function(error) {
    console.log("Failed!", error);
});
