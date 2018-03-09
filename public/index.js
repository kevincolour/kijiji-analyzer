$(document).ready(()=>{
    urlBase = 'https://kijiji-analzyer.herokuapp.com'
    var start = new Date().getTime();


   $('#searchButton').on('click', ()=>{








    
        let userSearchQuery = $('#userSearch').val(); 
        let userSearchLocation = $('#userLocation').val();
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
             
                console.log(success);

               


                let dataset = success.pricesList;

                //big
                let uniqueValues = Array.from(new Set (success.pricesList.map((x)=> Math.ceil(x)))).sort(function(a,b){return a - b});
                
                uniqueValuesCount = [];
                uniqueValues.forEach(function(value,index) {
                    var count = dataset.reduce(function(n, val) {
                        return n + (val === value);
                    }, 0);
                    
                    uniqueValuesCount.push(count);
                })
                let datasetReduced = [];
                let datasetReducedCount = [];
                // has to consist of at least 1 % of total data set
                const chartLimit = parseFloat(success.adAmount) * 0.01 ;
                console.log ((chartLimit));
                uniqueValuesCount.forEach((value,index) =>{
                    if (value > chartLimit){
                        datasetReduced.push(uniqueValues[index]);
                        datasetReducedCount.push(value);
                    }
                })
                
                console.log(datasetReduced);
                console.log(datasetReducedCount);
                console.log('unsorted val', success.allPrices)
                console.log('unique values: ', uniqueValues);
                console.log('values', success.pricesList);
                
                //chart generation ( open source)

                var ctx = document.getElementById("myChart").getContext('2d');
                
                var ctx2 = document.getElementById("myChartPretty").getContext('2d');
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
    })
})