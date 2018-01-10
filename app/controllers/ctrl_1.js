app.controller("ctrl_1", function($scope){
    
	$scope.data = model;
    console.log( $scope.data );

    totalData = model2;
 
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
 
    $scope.currencyExchange = function(x){
        if (x.id == 0){
            console.log('grivna');
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


    var totalArr = {} 

    $scope.addDataToTable = function() {
        
        totalArr[$scope.year] = {};
        totalArr[$scope.year][$scope.selected.month] = {
            records: []
        }
        $scope.currencyExchange($scope.currentCurrency.currency);

        totalArr[$scope.year][$scope.selected.month].records.unshift({
            selectedMonth: $scope.selected.month,
            number: $scope.number,
            year: $scope.year,
            moneyCosts: $scope.moneyCosts,
            moneyIncome: $scope.moneyIncome,
            description: "",
            label: ""
        }); 


        $scope.moneyCosts = "";
        $scope.moneyIncome = "";

        console.log(totalArr);

        $scope.sumArr();
        
    } 

    $scope.sumArr = function (){
        console.log(totalArr);
        for (var year in totalArr){ 
            for (var month in totalArr[year]){
                for (var record in totalArr[year][month]){
                    for (var x in totalArr[year][month][record]){
                        $scope.data.dataArr.unshift(totalArr[year][month][record][x]);
                    }
                }
            }
        }
        console.log($scope.data.dataArr);
        $scope.addDataInStorage();
    }


   


	$scope.addDataInStorage = function(){ 
		model = $scope.data; 
		window.localStorage.locStData = JSON.stringify(model);
        $scope.calculateProfit();
    }
    
	$scope.addTotalDataInStorage = function(){ 
        model2 = totalData; 
		window.localStorage.locStData222 = JSON.stringify(model2);
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
    $scope.numPerPage       = 3;   
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