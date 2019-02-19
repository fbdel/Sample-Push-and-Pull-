var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require("console.table");

var finalTotal= 0;

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "yourRootPassword",
  database: "bamazonDB"
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("====================================================================\n");
  
  start();


    
  
  
});

function start() {
    continueOrdering = false;
    
    inquirer.prompt({
        name: "start",
        type: "input",
        message: "Would you like to continue shop? (Y/N) "

    }).then ( function (answer) {
        if (answer.start === "Y" || answer.start === "y" ) {
            console.log("")
            console.log ("Great! Below is a list of the items we have in stock...\n")
            
            displayProducts(); 


        } else if (answer.start === "N" || answer.start === "n") {
            continueOrdering = false;
            console.log("------------------------------------------")
            console.log("Your FINAL TOTAL  is: $" + finalTotal);
            console.log("------------------------------------------\n")
            console.log("Thanks for shopping at Bamazon.");
            console.log("Bye for now!\n");
            connection.end();

        }
    })
}


function displayProducts (){
    console.log("PRODUCTS");
    console.log(
        "===================================================================="
    );
    
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        
        
        for (var i = 0; i < res.length; i++) {
            console.log(
                "ID # " +
                res[i].item_id +
                " | Item: " +
                res[i].product_name +
                " | Department:" +
                res[i].department_name +
                " | Price: $" +
                res[i].price +
                "| Stock#: " +
                res[i].stock_quantity 
            );
        }
        console.log(
          "====================================================================\n"
        );
        runSearch();
    });

}




function runSearch() {
    
    inquirer
      .prompt([
        {
          type: "input",
          message: "What is the ID of the product you would like to buy? ",
          name: "id_search"
        },
        
        {
          type: "input",
          message: "How many units of the product do you want to buy? ",
          name: "num_items"
        }
      ])
      .then(function(answer) {
        //   console.log(answer.num_items);
        //   console.log(answer.id_search);
 
          connection.query("SELECT * FROM products", function (err, res) {
              var requestID = parseInt(answer.id_search) - 1;
             

              
              if (err) throw err;
            //   console.log(requestID)
            //   console.log(res[requestID].price);
            //   console.log(res[requestID].stock_quantity);

              if (res[requestID].stock_quantity >= answer.num_items) {
                console.log("------------------------------------------")
                console.log("Horray we have what you are looking for!!!\n")
                var updatedStock = res[requestID].stock_quantity - answer.num_items;
                // console.log("UpdatedStock var is " + updatedStock)
                console.log("");
                console.log("Processing " + answer.num_items + " "+res[requestID].product_name + "(s)...\n");

                finalTotal += parseInt(res[requestID].price) * parseInt(answer.num_items);
                console.log("Your Order Has Been Completed. \n")
                console.log("Your current Total is: $" + finalTotal+"\n");

              
                var query = connection.query(                    
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: updatedStock
                        },
                        {
                            item_id: answer.id_search
                        }
                    ],
                    function (err, res) {
                        if (err) throw err;
                        
                        
                    },
                    // console.log("Process is complete, thanks for your patients\n"),
                    // console.log("Your total is: $" + res[requestID].price+ "\n"),
                    start()
                    
                );
                  
                
                
                
              } else {
                console.log("Sorry, Insufficient Quatity in out inventory \n");
                console.log("Please try again\n")
                start()
                

              }

              
            
          });
         

          
      });
    
}



function continueShopping() {
    
    inquirer.prompt({
        name: "start",
        type: "input",
        message: "Would you like to continue shop? (Y/N) "

    }).then(function (answer) {
        if (answer.start === "Y" || answer.start === "y") {
            // console.log("")
            // console.log("What esle would you like to order?\n")
            start()


        } else if (answer.start === "N" || answer.start === "n") {
            console.log("Your FINAL Total for today is: $" + finalTotal)
            console.log("Thanks for shopping at Bamazon.")
            console.log("Bye for now!")
            connection.end();

        }
    })
}





// function updateDatabase() {
//     console.log("Processing order...\n");
//     var query = connection.query(
//       "UPDATE products SET ? WHERE ?",
//       [
//         {
//           stock_quantity: updatedStock
//         },
//         {
//           item_id: answer.id_search
//         }
//       ],
//       function(err, res) {
//         if (error) throw error;
//         console.log ("Process is complete, thanks for your patients")
//         console.log(res.affectedRows + " products updated!\n");
//       }
//     );

//     // logs the actual query being run
//     console.log(query.sql);
// }

