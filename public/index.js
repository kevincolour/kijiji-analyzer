$(document).ready(()=>{
    
//     //globals for the scrape API
//     let timerId = 0;




//     function repeatQuery(){
//     $.ajax({
//         type: 'GET',
//         url : 'https://api.apify.com/v1/uESohuhnYLxmijy6a/crawlers/aHFsXCgT4Gr78rRkh/lastExec?token=ohLkfim9DQZGxTBnGyTXBW8ND',
//         success : (success) => {
//             console.log('here2');
//             console.log(success);
//             if (success.finishedAt != null){
//                 console.log('hooray')

//                 $.ajax({
//                     type: 'GET',
//                     url : 'https://api.apify.com/v1/uESohuhnYLxmijy6a/crawlers/aHFsXCgT4Gr78rRkh/lastExec/results?token=ohLkfim9DQZGxTBnGyTXBW8ND',
//                     success : (success) => {
//                         console.log('her5');
//                         console.log(success);
//                         clearInterval(timerId);
                        
//                     }
//                 })

                
//             }
//         }
//     })

//  }
 
 
 

    
    
//     $.ajax({
//         type: 'POST',
//         url : 'https://api.apify.com/v1/uESohuhnYLxmijy6a/crawlers/aHFsXCgT4Gr78rRkh/execute?token=HPnoYcbBHsRKL5X4HEifiAae7',
//         success : (success) => {
//             console.log('here2');
//             console.log(success);
//             if (success.finishedAt != null){
//                 console.log('hooray')
                
                
//             }
//         }
//     })



//     timerId = window.setInterval(repeatQuery, 1000);
    
    
    urlBase = 'https://kijiji-analyzer.herokuapp.com';
    var start = new Date().getTime();
    let alreadySearching = false;

    
    $('#objectSearch').focus();
    $(document).keypress((e)=>{
     if (e.which == 13){
         $('#searchButton').trigger("click");
     }   
    }

)

    $(document).on({
        ajaxStart: function() { $(".modal").show();$("#progressText").show();    },
        ajaxStop: function() { $(".modal").hide(); $("#progressText").hide(); }    
    });


   $('#searchButton').on('click.mynamespace', ()=>{
       if (!alreadySearching) {
           $('#fullResult').load("/noDynamic.html");
    alreadySearching = true;    
    //console.log('here');
    
        let userSearchQuery = $('#objectSearch').val()
        let userSearchLocation = $('#userLocation').val()
        //$('#progressUpdate').html('REQUEST ACCPETEND NOW SEARCHING');
        $.ajax({
            type: 'POST',
            url: urlBase + '/scrape',
            data: {search : userSearchQuery,
                    location : userSearchLocation
            },
            error: (error)=>{

            },
            success : (success) =>{
                var end = new Date().getTime();
                var time = (end - start) / 1000;
                console.log('Execution time: ' + time);
             
               // console.log(success);

               

                
                
                let dataset = success.pricesList;
                
                //big
                let uniqueValues = Array.from(new Set (success.pricesList.map((x)=> Math.ceil(x)))).sort(function(a,b){return a - b});
                
                
                uniqueValuesCount = [];
                uniqueValues.forEach(function(value,index) {
                    var count = dataset.reduce(function(n, val) {
                        return n + (val === value);
                    }, 0);
                    
                    uniqueValuesCount.push(parseInt(count));
                })


                uniqueValuesCountRange = [];
                uniqueValuesRange = [];
                let index = 0;
                const rangeNumber = uniqueValues.length / 15;
                while (index < uniqueValues.length - rangeNumber){
                    // this is the length of the range of the graph

                    let innerIndex = 0;
                    let totalAmount = 0;
                    let pricesRangeAmount = 0;
                    while(innerIndex < rangeNumber) {
                        totalAmount += uniqueValuesCount[index];
                        pricesRangeAmount += uniqueValues[index];
                        index += 1;
                        innerIndex += 1;
                    }
                    uniqueValuesRange.push(Math.floor(pricesRangeAmount / rangeNumber)); 
                    uniqueValuesCountRange.push(totalAmount);
                    index += 1;
                }
                // console.log(uniqueValues);
                // console.log(uniqueValuesRange);
                // console.log(uniqueValuesCountRange);


                let datasetReduced = [];
                let datasetReducedCount = [];
                // has to consist of at least 1 % of total data set
                const chartLimit = parseFloat(success.adAmount) * 0.01 ;
               // console.log ((chartLimit));
                uniqueValuesCount.forEach((value,index) =>{
                    if (value > chartLimit){
                        datasetReduced.push(uniqueValues[index]);
                        datasetReducedCount.push(value);
                    }
                })
                let modeVarAmount =  Math.max.apply(Math,uniqueValuesCount);


                let indexOfMode = uniqueValuesCount.indexOf(modeVarAmount);
               // console.log(indexOfMode);
                let modeVar = uniqueValues[indexOfMode];
                console.log('user serach,', userSearchQuery);
                $divMode = $('<div></div>', {id: 'divMode'});
                $divMedian = $('<div></div>', {id: 'divMedian'});
                $divVar = $('<div></div>',{id: 'averageResult'});
                $divAdAmount = $('<div></div>', {id: 'adAmount'});
                $divAdAmountNumber = $('<div>'+ success.adAmount + '</div>');
                $divAdAmountNumber.attr('id', 'adAmountNumber');
                $userSearchDiv = $('<div>' + userSearchQuery.trim() + '</div>');
                $userSearchDiv.attr('id', 'userSearchDiv');
                 
                
                $divVar.append(Math.floor(success.average));
                $divAdAmount.append('Out of ').append($divAdAmountNumber).append('ads for ').append($userSearchDiv).append(', the results are');
                $divMode.append(modeVar);
                $divMedian.append(success.median);
                //$divVar.append("The Median is" + success.median);
                $('#meanDiv').html("The average is :").append($divVar);
                $('#modeDiv').html("The mode is :").append($divMode);
                $('#medianDiv').html("The median is :").append($divMedian);
                $('#searchResult').append($divAdAmount);
                
                //chart generation ( open source)

                var ctx = document.getElementById("myChart").getContext('2d');
                
                var ctxRange = document.getElementById("myChartRange").getContext('2d');

                var ctx2 = document.getElementById("myChartPretty").getContext('2d');
                alreadySearching = false;
var myChart = new Chart(ctx, {
    type: 'line',
    
    data: {
        labels : uniqueValues,
        datasets: [{
            label: 'Amount of Prices',
            //xAxisID: 'Price',
            //yAxisID: '# of Sellers',
            cubicInterpolationMode : 'default',
           // backgroundColor : '#3399ff',
            borderColor : '#3399ff',
            data: uniqueValuesCount,
            
        }]
    },
    options: {
        scales: {
            xAxes: [{
                ticks: {
                   // fontSize: 40
                }
            }],
            yAxes: [{
                gridLines: {

                },
                ticks: {
                    beginAtZero:true,
                    fontSize: 20
                }
            }]
        }
    }


});


var myChart = new Chart(ctxRange, {
    type: 'line',
    data: {
        labels : uniqueValuesRange,
        datasets: [{
            label: 'Amount of Prices',
            //xAxisID: 'Price',
            //yAxisID: '# of Sellers',
            //cubicInterpolationMode : 'default',
            backgroundColor : '#99ff99',
            borderColor : '#00b300',
            data: uniqueValuesCountRange,
            
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});



var myChart = new Chart(ctx2, {
    type: 'line',
    data: {
        labels : datasetReduced,
        datasets: [{
            label: 'Amount of Prices',
            //xAxisID: 'Price',
            //yAxisID: '# of Sellers',
            cubicInterpolationMode : 'default',
            backgroundColor : '#99ff99',
            borderColor : '#00b300',
            data: datasetReducedCount,
            
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});





            } 
        })
        
    }
    })
})