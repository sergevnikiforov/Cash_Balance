app.controller("ctrl_1", function($scope){
    

	$scope.data = model;
    console.log( $scope.data );
 

    var today = document.querySelector(".today");
    var dateToday = new Date;
    var y = dateToday.getFullYear();
    var m =  dateToday.getMonth(); 
    var d = dateToday.getDate();

    //today.innerHTML = "date today: " + d + "." + ( m + 1 ) + "." + y ;

    $scope.data = model;
	$scope.number = d;
	$scope.year = y;
    
    
	$scope.months =[{ month: "Январь"},
					{ month: "Февраль"},
					{ month: "Март"},
					{ month: "Апрель"},
					{ month: "Май"},
					{ month: "Июнь"},
					{ month: "Июль"},
					{ month: "Август"},
					{ month: "Сентябрь"},
					{ month: "Октябрь"},
					{ month: "Ноябрь"},
					{ month: "Декабрь"}];

	$scope.selected = $scope.months[m];	
 

    // Пересчет валют:
    $scope.currencyExchange = function(x){
        if (x.id == 0){
            $scope.moneyCosts = $scope.moneyCosts;
            $scope.moneyIncome = $scope.moneyIncome;
        } else if (x.id == 1){
            console.log('dollar');
            $scope.moneyCosts = $scope.moneyCosts * 2;
            $scope.moneyIncome = $scope.moneyIncome * 2;
        } else if (x.id == 2){
            console.log('euro');
            $scope.moneyCosts = $scope.moneyCosts * 3;
            $scope.moneyIncome = $scope.moneyIncome * 3;
        }
    }
  

    /* ******************* */
    $scope.currencyArr = [
        {
            id: 0,
            name: "Гривна", 
            sign: "&#8372;"
        },
        {
            id: 1,
            name: "Доллар США", 
            sign: "&#36;" 
        },
        {
            id: 2,
            name: "Евро", 
            sign: "&euro;", 
        }  
    ];
    $scope.currentCurrency = {
        currency: $scope.currencyArr[0]
    };
    /* ******************* */
     

    $scope.addDataToTable = function() {
        $scope.currencyExchange($scope.currentCurrency.currency);

        $scope.data.dataArr.unshift({
            selectedMonth: $scope.selected.month,
            number: $scope.number,
            year: $scope.year,
            moneyCosts: $scope.moneyCosts,
            moneyIncome: $scope.moneyIncome,
            description: "",
            label: ""
        });
        $scope.addDataInStorage(); 
        $scope.moneyCosts = "";
        $scope.moneyIncome = "";
    } 


	$scope.addDataInStorage = function(){ 
		model = $scope.data; 
		window.localStorage.locStData = JSON.stringify(model);
        $scope.calculateProfit();
    }

    
    $scope.funcForGraph = function(){
        $scope.res = {};
        var dataGraph = $scope.data.dataArr; 
        for (var i = 0; i < dataGraph.length; i++){
            $scope.res[dataGraph[i].year] = $scope.res[dataGraph[i].year] || {};
            $scope.res[dataGraph[i].year][dataGraph[i].selectedMonth] = $scope.res[dataGraph[i].year][dataGraph[i].selectedMonth] || {plus: [], minus: []};

           // $scope.res[dataGraph.year] = dataGraph[i].year;
            $scope.res[dataGraph[i].year][dataGraph[i].selectedMonth].plus.push(Number(dataGraph[i].moneyIncome));
            $scope.res[dataGraph[i].year][dataGraph[i].selectedMonth].minus.push(Number(dataGraph[i].moneyCosts));
        }
        sumForGraph($scope.res);  
        console.log($scope.res);  
    }


    function sumForGraph(res){   
        for (year in res){ 
            for (month in res[year]){ 
                for (x in res[year][month]){ 
                            
                    var minus = 0;
                    var plus = 0;
                    for (var i = 0; i < res[year][month].minus.length; i++){
                        minus = minus + res[year][month].minus[i];
                    }
                    for (var i = 0; i < res[year][month].plus.length; i++){
                        plus = plus + res[year][month].plus[i];
                    }
                }
                res[year][month].minus.splice(0);
                res[year][month].minus.push(minus);
                res[year][month].plus.splice(0);
                res[year][month].plus.push(plus);
            } 
        }
        getRes222(res);
    }

    function getRes222(res) {
        $scope.res222 = [];
        for (year in res){ 
            for (month in res[year]){ 
                var profit = Number(res[year][month].plus) - Number(res[year][month].minus);
                $scope.res222.push( {   minus: Number(res[year][month].minus), 
                                        plus: Number(res[year][month].plus), 
                                        year, 
                                        month,
                                        profit: profit
                                    });
            }
        }
        console.log($scope.res222);
    }



	$scope.deleteDataFromTable = function(index) { 
        console.log(index + $scope.begin);
		$scope.data.dataArr.splice(index + $scope.begin, 1);
		$scope.addDataInStorage();
        $scope.calculateProfit();
	} 
	
	
	$scope.clearStorage = function() {
        window.localStorage.clear();
        location.reload();
    }
    
    
    $scope.calculateProfit = function() { 
        $scope.sumPlus = 0;
        $scope.sumMinus = 0;   
        for (var i = 0; i < $scope.data.dataArr.length; i++){
            $scope.sumPlus = $scope.sumPlus + +$scope.data.dataArr[i].moneyIncome;
            $scope.sumMinus = $scope.sumMinus + +$scope.data.dataArr[i].moneyCosts;
        }
        $scope.profit = $scope.sumPlus - $scope.sumMinus;
    }   

    $scope.addDescription = function(index){
        $scope.index = $scope.begin + index;
        console.log($scope.index);
        $scope.formaOfDescription = document.querySelector(".forma");
        $scope.formaOfDescription.style.display = "block";
        $scope.textareaOfDescription = document.querySelector(".textarea");       
        // отображение сохраненных данных:
        $scope.textareaOfDescription.value = $scope.data.dataArr[$scope.index].description;
    }	
    
    $scope.saveDescription = function(){
        $scope.description = document.querySelector(".textarea").value;
        $scope.data.dataArr[$scope.index].description = $scope.description;
        
        $scope.addDataInStorage();
        
        $scope.displayLabel($scope.index);
        $scope.star = "Сохранено";
    }	
    
    $scope.closeDescription = function(){
        $scope.formaOfDescription.style.display = "none";
        $scope.star = "";
    }
    
    $scope.displayLabel = function(x){
        console.log(x);
        if ($scope.data.dataArr[$scope.index].description !== ''){
            $scope.data.dataArr[x].label = "&#10004;";
        } else {
            $scope.data.dataArr[x].label = "";
        }
        $scope.addDataInStorage();
    }
  
   
    $scope.filteredPages    = [];
    $scope.currentPage      = 1;    
    $scope.numPerPage       = 8;    
    $scope.maxSize          = 5;    

    $scope.numPages = function(){
        return Math.ceil($scope.data.dataArr.length / $scope.numPerPage);
    };

    $scope.$watch(function(){
        $scope.begin = (($scope.currentPage - 1) * $scope.numPerPage);
        $scope.end = $scope.begin + $scope.numPerPage;       
        $scope.filteredPages = $scope.data.dataArr.slice($scope.begin, $scope.end);     
    });   
  
});