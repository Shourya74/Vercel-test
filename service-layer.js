class connectorClass {

  // production db
  hostname = 'SG-Orcus-4098-mysql-master.servers.mongodirector.com';
  portno = '3306';
  username = '3SGhzVAIGO';
  password = '1TwloESfqt!';
  databaseName = 'ORCUS';

  // testing db
  // hostname = 'SG-OrcusTest-3248-master.servers.mongodirector.com';
  // portno = '3306';
  // username = '3SGhzVAIGO';
  // password = '1TwloESfqt!';
  // databaseName = '3SGhzVAIGO';


  mysql = require('mysql');

  con = null;

  constructor() {
    this.initiateConnection();
  }

  initiateConnection() {

    this.con = this.mysql.createConnection({
      host: this.hostname,
      user: this.username,
      password: this.password,
      database: this.databaseName,
      multipleStatements: true
    });

    this.con.connect(function (err) {
      if (err) throw err;
      console.log("mySQL connection established");
    });

    this.con.on("error", () => {
      console.log("mySQL connection dropped. Attempting to Re-establish connection.");
      this.con.connect(function (err) {
        if (err) throw err;
        console.log("mySQL connection established");
      });
    })
  }
  //workshop compliant
  async getValueOfTools(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT Sum(`Value`) as valuetools from `Tools` where `Part of Kit` IS NULL AND `Permanent` < 2 AND `Workshop ID` ='" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getValueOfTools");
    }
  }
  //workshop compliant
  async getIssuerDetails(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT * FROM `Technicians` where `Authorised` = 2 AND `Workshop ID` ='" + workshop_id + "';");
      return rows[0];
    }
    catch{
      console.log("Error in getValueOfTools");
    }
  }
  //workshop compliant
  async getNoOfEqp(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) as totaleqp from `Tools` where `Part of Kit` IS NULL AND `Permanent` > 1 AND `Workshop ID` ='" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getNoOfEqp");
    }
  }
  //workshop compliant
  async getValueOfEqp(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT Sum(`Value`) as valueeqp from `Tools` where `Part of Kit` IS NULL AND `Permanent` > 1 AND `Workshop ID` ='" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getValueOfEqp");
    }
  }
  //workshop compliant
  async getTotalValue(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT Sum(`Value`) as totalvalue from `Tools` where `Part of Kit` IS NULL AND `Workshop ID` ='" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getValueOfEqp");
    }
  }
  //workshop compliant
  async getDefaultCurrency(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Default Currency Code`, `Default Currency Symbol` from `Workshop Details` where `Workshop ID` = '" + workshop_id + "';");
      return rows[0];
    }
    catch{
      console.log("error in getDefaultCUrrency() service-layer");
    }
  }
  //workshop compliant
  async setDefaultCurrency(code, symbol, workshop_id) {
    try {
      var query = "UPDATE `Workshop Details` SET `Default Currency Code` = '"+code+"', `Default Currency Symbol` = '"+symbol+"' where `Workshop ID` = '"+workshop_id+"';";
      console.log(query);
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch{
      console.log("error in setDefaultCUrrency() service-layer");
    }
    return 0;
  }
  //workshop compliant
  async getNoOfPendingReports(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) from `Repair History` where `Resolve Datetime` IS NULL AND `Workshop ID`='" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getPendingReports");
    }
  }
  //workshop compliant
  async getToolMaintenanceCost(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT Sum(`Cost`) as cost from `Repair History` INNER JOIN `Tools` ON `Repair History`.`Tool Code` =  `Tools`.`Tool Code` AND `Tools`.`Permanent` < 2 AND `Tools`.`Workshop ID` ='" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getToolMaintenanceCost");
    }
  }
  //workshop compliant
  async getEqpMaintenanceCost(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT Sum(`Cost`) as cost from `Repair History` INNER JOIN `Tools` ON `Repair History`.`Tool Code` =  `Tools`.`Tool Code` AND `Tools`.`Permanent` > 1 AND `Tools`.`Workshop ID` ='" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getEqpMaintenanceCost");
    }
  }
  //workshop compliant
  async updateWarranty(toolcode, rep_war_ed, workshop_id) {
    var query = "Update `Tools` SET `Warranty Enddate` = '" + rep_war_ed + "' where `Tool Code` = '" + toolcode + "' AND `Workshop ID` = '" + workshop_id + "'; ";
    try {
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch {
      console.log("Error in updateWarranty");
      return 0;
    }
  }
  //workshop compliant
  async getTotalMaintenanceCost(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT Sum(`Cost`) as cost from `Repair History` where `Workshop ID`='" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getTotalMaintenanceCost");
    }
  }
  //workshop compliant
  async gettop5issuedtools(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Tool Code`, `Tool Name`,COUNT(`Tool Code`) AS NumberOfIssues FROM `Issue History` where `Workshop ID` = '" + workshop_id + "' GROUP BY `Tool Code`, `Tool Name` Order BY NumberOfIssues DESC LIMIT 5 ;");
      return rows;
    }
    catch{
      console.log("Error in gettop5issuedtools");
    }
  } 
  async getTopReportedHandTools(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT r.`Tool Code`, r.`Tool Name`, COUNT(r.`Tool Code`) AS Number FROM `Repair History` r INNER JOIN `Tools` t ON r.`Tool Code` = t.`Tool Code` AND t.`Permanent` = 1 AND t.`Workshop ID`= '" + workshop_id + "' GROUP BY r.`Tool Code`, r.`Tool Name` Order BY Number DESC LIMIT 5;");
      return rows;
    }
    catch{
      console.log("Error in getTopReportedHandTools");
    }
  }
  async getTopReportedSpecialTools(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT r.`Tool Code`, r.`Tool Name`, COUNT(r.`Tool Code`) AS Number FROM `Repair History` r INNER JOIN `Tools` t ON r.`Tool Code` = t.`Tool Code` AND t.`Permanent` = 0 AND t.`Workshop ID`= '" + workshop_id + "' GROUP BY r.`Tool Code`, r.`Tool Name` Order BY Number DESC LIMIT 5;");
      return rows;
    }
    catch{
      console.log("Error in getTopReportedSpecialTools");
    }
  }
  async getTopMaintenanceEquipment(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Tool Code`, `Tool Name`, `Maintenance Cost` FROM `Tools` where `Workshop ID`= '" + workshop_id + "' AND `Permanent` IN (2,3) Order BY `Maintenance Cost` DESC LIMIT 5;");
      return rows;
    }
    catch{
      console.log("Error in getTopMaintenanceEquipment");
    }
  }
  //workshop compliant
  async gethandtoolreportsdata(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Cause`, COUNT(*) AS Number FROM `Repair History` INNER JOIN `Tools` ON `Repair History`.`Tool Code` = `Tools`.`Tool Code` AND `Tools`.`Permanent` = 1 AND `Tools`.`Workshop ID`= '" + workshop_id + "' GROUP BY `Cause` Order BY Number DESC LIMIT 5");
      return rows;
    }
    catch{
      console.log("Error in gethandtoolreportsdata");
    }
  }
  //workshop compliant
  async getspltoolreportsdata(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Cause`, COUNT(*) AS Number FROM `Repair History` INNER JOIN `Tools` ON `Repair History`.`Tool Code` = `Tools`.`Tool Code` AND `Tools`.`Permanent` = 0 AND `Tools`.`Workshop ID`= '" + workshop_id + "' GROUP BY `Cause` Order BY Number DESC LIMIT 5");
      return rows;
    }
    catch{
      console.log("Error in getspltoolreportsdata");
    }
  }
  //workshop compliant
  async geteqpreportsdata(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Cause`, COUNT(*) AS Number FROM `Repair History` INNER JOIN `Tools` ON `Repair History`.`Tool Code` = `Tools`.`Tool Code` AND `Tools`.`Permanent` > 2 AND `Tools`.`Workshop ID`= '" + workshop_id + "' GROUP BY `Cause` Order BY Number DESC LIMIT 5");
      // if(rows.length == 0)

      // else
      return rows;
    }
    catch{
      console.log("Error in geteqpreportsdata");
    }
  }
  //workshop compliant
  async getreportsdata(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Cause`, COUNT(*) AS Number FROM `Repair History` where `Workshop ID` = '" + workshop_id + "' GROUP BY `Cause` Order BY Number DESC LIMIT 5");
      return rows;
    }
    catch{
      console.log("Error in getreportsdata");
    }
  }
  //workshop compliant
  async getAvgResponseTime(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Report Datetime`, `Resolve Datetime` FROM `Repair History` where `Resolve Datetime` IS NOT NULL AND `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch {
      console.log("Error in getAvgResponseTime");
    }
  }
  //workshop compliant
  async getResponseTypeData(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Action`, Count(`Action`) as Number FROM `Repair History` where `Workshop ID`= '" + workshop_id + "' GROUP BY `Action`");
      return rows;
    }
    catch {
      console.log("Error in getResponseTypeData");
    }
  }
  //workshop compliant
  async getFilteredToolMaintenanceCost(start, end, workshop_id) {
    start += " 00:00:00";
    end += " 00:00:00";
    var query = "SELECT SUM(`Cost`) as Number FROM `Repair History` INNER JOIN `Tools` ON `Repair History`.`Tool Code` = `Tools`.`Tool Code` AND `Repair History`.`Report Datetime` > '" + start + "' AND `Repair History`.`Report Datetime` < '" + end + "' AND `Tools`.`Permanent` < 2 AND `Tools`.`Workshop ID`='" + workshop_id + "';";
    // console.log(query);
    try {
      var rows = await this.executeQuery(query);
      return rows;
    }
    catch {
      console.log("Error in getFilteredToolMaintenanceCost");
    }
  }
  //workshop compliant
  async getNoOfIssues(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) as totalissues FROM `Issue History` where `Workshop ID`='" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getNoOfIssues");
    }
  }
  //workshop compliant
  async getFilteredEqpMaintenanceCost(start, end, workshop_id) {
    start += " 00:00:00";
    end += " 00:00:00";
    var query = "SELECT SUM(`Cost`) as Number FROM `Repair History` INNER JOIN `Tools` ON `Repair History`.`Tool Code` = `Tools`.`Tool Code` AND `Repair History`.`Report Datetime` > '" + start + "' AND `Repair History`.`Report Datetime` < '" + end + "' AND `Tools`.`Permanent` > 1 AND `Tools`.`Permanent` < 4 AND `Tools`.`Workshop ID`='" + workshop_id + "';";
    // var query = "SELECT SUM(`Cost`) as Number FROM `Repair History` WHERE `Report Datetime` > '" + start + "' AND `Report Datetime` < '" + end + "' AND `Workshop ID` = '" + workshop_id + "';";
    // console.log(query);
    var rows = [];
    try {
      rows = await this.executeQuery(query);
      if (rows.length == 0)
        rows[0]["Number"] = 0;
      return rows;
    }
    catch {
      console.log("Error in getFilteredEqpMaintenanceCost");
    }
  }





  //workshop compliant
  async getWorkshopDetails(workshop_id) {
    var rows = await this.executeQuery("SELECT * FROM `Workshop Details` where `Workshop ID`='" + workshop_id + "'");
    return rows;
  }
  //workshop compliant
  async updateRegularHolidayData(workshop_id, regularholidaydata) {
    var rows = await this.executeQuery("UPDATE `Workshop Details` SET `Regular Holidays` = '" + regularholidaydata + "' where `Workshop ID` = '" + workshop_id + "' ");
    return rows;
  }
  //workshop compliant
  async changePassword(empid, newPassword) {
    try {
      await this.executeQuery("UPDATE `Technicians` SET `Password` = '" + newPassword + "' where `Emp ID` = '" + empid + "'; ");
      return 1;
    }
    catch{
      console.log("Error in cc.changePassword()");
    }
  }

  //workshop compliant
  async updateTimeFormat(timeformat, id) {
    try {
      await this.executeQuery("UPDATE `Technicians` SET `Time Format` = '" + timeformat + "' where `Emp ID` = '" + id + "'; ");
      // return rows;
    }
    catch{
      console.log("Error in updateTimeFormat");
    }
  }
  //workshop compliant
  async getAllRegisteredEmails() {
    try {
      var rows = await this.executeQuery("SELECT DISTINCT `Email` from `Technicians`");
      return rows;
    }
    catch{
      console.log("Error in getAllCompanyIDs");
    }
  }
  //workshop compliant
  async getAllCompanyNames() {
    try {
      var rows = await this.executeQuery("SELECT DISTINCT `Company Name` from `Workshop Details`");
      return rows;
    }
    catch{
      console.log("Error in getAllCompanyIDs");
    }
  }

  //workshop compliant
  async getAllWorkshopDetails() {
    try {
      var rows = await this.executeQuery("SELECT `Company Name`, `Workshop ID`, `Workshop Name` from `Workshop Details`;");
      return rows;
    }
    catch{
      console.log("Error in getAllWorkshopDetails");
    }
  }

  //workshop compliant
  async updateSpecialHolidayData(workshop_id, specialholidaydata) {
    var rows = await this.executeQuery("UPDATE `Workshop Details` SET `Special Holidays` = '" + specialholidaydata + "' where `Workshop ID` = '" + workshop_id + "' ");
    return rows;
  }
  //workshop compliant
  async getToolDetails(toolcode, workshop_id) {
    var rows = await this.executeQuery("SELECT * FROM Tools where `Tool Code`='" + toolcode + "' and `Workshop ID`= '" + workshop_id + "';");
    return rows;
  }
  //workshop compliant
  async getLastReportDate(tcode, workshop_id) {
    var query = "SELECT * FROM `Repair History` WHERE `Tool Code` = '" + tcode + "' and `Workshop ID` = '" + workshop_id + "' Order by `Report Datetime` DESC;";
    //  console.log(query);
    var rows = await this.executeQuery(query);
    return rows;
  }
  //workshop compliant
  async getAMCSheetData(toolcode, workshop_id) {
    var query = "SELECT * FROM `Repair History` WHERE `Tool Code` = '" + toolcode + "' and `Workshop ID` = '" + workshop_id + "' Order by `Report Datetime`;";
    console.log(query);
    var rows = await this.executeQuery(query);
    //  console.log(rows);
    return rows;
  }
  //workshop compliant
  async uploadSignUpRequest(emp_id, fname, lname, payload, workshop_id) {
    var op = "signup request";
    var moment = require('moment-timezone');
    var x = moment();
    x = x.format("YYYY-MM-DD HH:mm:ss").toString();
    var query = "INSERT INTO `Requests`(`Emp ID`, `First Name`, `Last Name`, `Operation`, `Request DateTime`, `payload`, `Workshop ID`) VALUES (" + "'" + emp_id + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'" + op + "'" + "," + "'" + x + "'" + "," + "'" + payload + "','" + workshop_id + "')";
    try {
      var rows1 = await this.executeQuery(query);
      return 1;
    }
    catch (error) {
      console.log(error);
      return 0;
    }

  }
  //workshop compliant
  async checkPendingSurrenderRequest(toolcode, workshop_id) {
    var op = "surrendered";
    try {
      var rows = await this.executeQuery("SELECT * from `Requests` where `Tool Code` = '" + toolcode + "' AND `Operation` = '" + op + "' AND `Resolve Datetime` IS NULL AND `Workshop ID`='" + workshop_id + "';");
      return rows;
    }
    catch {
      console.log("Error in checkPendingSurrenderRequest");
      return 0;
    }
  }

  //workshop compliant
  async surrenderTool(toolcode, x, reqtime, workshop_id) {
    var op = "surrendered";
    var requestQuery = "UPDATE `Requests` SET `Resolve Datetime` =  '" + x + "', `Result` = '" + op + "' WHERE `Tool Code` = '" + toolcode + "' AND `Request Datetime` = '" + reqtime + "' AND `Workshop ID` = '" + workshop_id + "';";
    var toolQuery = "UPDATE `Tools` SET `Allocated To` = NULL where `Tool Code` = '" + toolcode + "' AND `Workshop ID` = '" + workshop_id + "';"
    var query = requestQuery + toolQuery;
    console.log(query);
    try {
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch {
      console.log("Error in surrenderTool");
      return 0;
    }
  }
  //workshop compliant
  async getAllTechnicians(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT * FROM `Technicians` where `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getAllTechnicians");
    }
  }


  executeQuery(sql) {
    //console.log(this.con.state);
    if (this.con.state == 'disconnected') {
      this.initiateConnection();
    }
    return new Promise((resolve, reject) => {
      this.con.query(sql, (err, rows) => {
        if (err)
          return reject(err);
        resolve(rows);
      });
    });
  }
  closeConnection() {
    // this.con.end(function (err) {
    //   if (err) {
    //     return console.log('error:' + err.message);
    //   }
    //   //console.log('Closed the database connection.');
    //   this.con = null;
    // });
  }

  //workshop compliant
  async getIssueRegister(workshop_id) {
    var is = "requested issue of";
    var rows1 = await this.executeQuery("SELECT r.`Tool Code`, r.`Tool Name`, r.`Emp ID`, r.`First Name`, r.`Last Name`, r.`Request Datetime`, r.`Result`, i.`Return DateTime` FROM `Issue History` i RIGHT JOIN `Requests` r ON i.`Issue DateTime` = r.`Resolve Datetime` where r.`Result` IS NULL AND r.`Workshop ID` = '" + workshop_id + "' AND r.`Operation` = '" + is + "' Order By r.`Request DateTime` DESC;");
    var rows2 = await this.executeQuery("SELECT r.`Tool Code`, r.`Tool Name`, r.`Emp ID`, r.`First Name`, r.`Last Name`, r.`Request Datetime`, r.`Result`, i.`Return DateTime` FROM `Issue History` i RIGHT JOIN `Requests` r ON i.`Issue DateTime` = r.`Resolve Datetime` where r.`Result` IS NOT NULL AND r.`Workshop ID` = '" + workshop_id + "' AND r.`Operation` = '" + is + "' Order By r.`Request DateTime` DESC");
    var rows = rows1.concat(rows2);
    return rows;
  }
  //workshop compliant
  async getMaxID() {
    var row1 = await this.executeQuery("select max(`Emp ID`) from `Technicians`;");
    var row2 = await this.executeQuery("select max(`Emp ID`) from `Requests`;");
    if (row1[0]["max(`Emp ID`)"] > row2[0]["max(`Emp ID`)"]) {
      return row1[0]["max(`Emp ID`)"] + 1;
    }
    else {
      return row2[0]["max(`Emp ID`)"] + 1;
    }
  }

  //workshop compliant
  async assignTools(cartItems, emp_id, x, fname, lname, workshop_id) {
    var updateQuery = "";
    //var issueQuery = "INSERT INTO `Issue History`(`Emp ID`, `First Name`, `Last Name`, `Tool Name`, `Tool Code`, `Issue DateTime`) VALUES ";
    for (var i = 0; i < cartItems.length; i++) {
      if (i != cartItems.length - 1) {
        //issueQuery = issueQuery + "(" + "'" + emp_id + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'" + cartItems[i].name + "'" + "," + "'" + cartItems[i].id + "'" + "," + "'" + x + "'" + "),";
        updateQuery = updateQuery + "UPDATE `Tools` SET `Allocated To`=" + "'" + emp_id + "', `Status`='1' " + "WHERE `Tool Code` =" + "'" + cartItems[i].id + "' AND `Workshop ID` = '" + workshop_id + "'" + ";";
      }
      else {
        //issueQuery = issueQuery + "(" + "'" + emp_id + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'" + cartItems[i].name + "'" + "," + "'" + cartItems[i].id + "'" + "," + "'" + x + "'" + ");";
        updateQuery = updateQuery + "UPDATE `Tools` SET `Allocated To`=" + "'" + emp_id + "', `Status`='1' " + "WHERE `Tool Code` =" + "'" + cartItems[i].id + "' AND `Workshop ID` = '" + workshop_id + "'" + ";";
      }
    }

    var query = updateQuery;

    try {
      var rows1 = await this.executeQuery(query);
    }
    catch (error) {
      console.log(error);
      return 0;
    }
    return 1;
  }

  // not workshop compliant
  //   async issueTools(cartItems, emp_id, x, y, fname, lname) {
  //     var op = "issued";
  //     var notiQuery = " INSERT INTO `Notifications` (`Operation`, `First Name`, `Last Name`, `Tool Name`, `Timestamp`) values " 
  //     //('"+toolname+"', '"+fname+"', '"+lname+"', '"+op+"')" ;
  //     var updateQuery = "";
  //     var issueQuery = "INSERT INTO `Issue History`(`Emp ID`, `First Name`, `Last Name`, `Tool Name`, `Tool Code`, `Issue DateTime`, `Expected Return DateTime`) VALUES ";
  //     for(var i=0; i<cartItems.length;i++){
  //       if(i!= cartItems.length -1){
  //         issueQuery = issueQuery + "(" + "'"+emp_id +"'"+"," + "'"+fname+"'"+","+ "'"+lname+"'"+","+ "'"+cartItems[i].name+"'"+ ","+"'"+ cartItems[i].id + "'"+"," +"'"+x +"'"+ "," + "'"+y+"'" + "),";
  //         updateQuery = updateQuery + "UPDATE `Tools` SET `Allocated To`="+ "'"+emp_id+"', `Status`='1' " + "WHERE `TOOL Code` =" + "'"+ cartItems[i].id + "'" + ";";
  //         notiQuery = notiQuery +  "(" + "'"+op+"'"+"," + "'"+fname+"'"+","+ "'"+lname+"'"+","+ "'"+x+"'"+ "),";
  //       }
  //       else{
  //         issueQuery = issueQuery + "(" + "'"+emp_id +"'"+"," + "'"+fname+"'"+","+ "'"+lname+"'"+","+ "'"+cartItems[i].name+"'"+ ","+"'"+ cartItems[i].id + "'"+"," +"'"+x +"'"+  "," + "'"+y+"'" + ");";
  //         updateQuery = updateQuery + "UPDATE `Tools` SET `Allocated To`="+ "'"+emp_id+"', `Status`='1' " + "WHERE `TOOL Code` =" + "'"+ cartItems[i].id + "'" + ";";
  //         notiQuery = notiQuery +  "(" + "'"+op+"'"+"," + "'"+fname+"'"+","+ "'"+lname+"'"+","+ "'"+cartItems[i].name+"'"+ ");";

  //       }
  //     }
  //     var query = issueQuery + updateQuery + notiQuery ;
  //     try{
  //       var rows1 = await this.executeQuery(query);
  //       }
  //       catch(error){
  //         console.log(error);
  //         return 0;
  //       }
  //       return 1;
  // }

  //workshop compliant
  async getRepairHistoryOfATool(tcode, startDate, endDate, workshop_id) {
    startDate += " 00:00:00";
    endDate += " 00:00:00";
    var query = "SELECT * FROM `Repair History` WHERE `Tool Code` = '" + tcode + "' AND `Report Datetime` > '" + startDate + "' AND `Report Datetime` < '" + endDate + "' AND `Workshop ID`= '" + workshop_id + "' Order by `Report Datetime`;";
    //  console.log(query);
    var rows = await this.executeQuery(query);
    //  console.log(rows);
    return rows;
  }
  //workshop compliant
  async updateSeenNotification(notiTime, workshop_id) {
    try {
      var rows = await this.executeQuery("UPDATE `Notifications` SET `Seen` = 1 where `Timestamp` = '" + notiTime + "' and `Workshop ID`= '" + workshop_id + "';");
    }
    catch {
      console.log("Error in updateSeenNotifications");
    }
  }
  //workshop compliant
  async rejectSurrender(toolcode, x, reqtime, workshop_id) {
    var op = "surrender rejected";
    var query = "UPDATE `Requests` SET `Resolve Datetime` =  '" + x + "', `Result` = '" + op + "' WHERE `Tool Code` = '" + toolcode + "' AND `Request Datetime` = '" + reqtime + "' AND `Workshop ID` = '" + workshop_id + "';";
    console.log(query);
    try {
      var rows1 = await this.executeQuery(query);
      return 1;
    }
    catch (error) {
      console.log(error);
      return 0;
    }
  }
  //workshop compliant
  async rejectIssue(toolname,toolcode, x, reqtime, workshop_id) {
    var op = "issue rejected";
    var st = 1;
    var requestQuery = "UPDATE `Requests` SET `Resolve Datetime` =  '" + x + "', `Result` = '" + op + "' WHERE `Tool Name` = '" + toolname + "' AND `Request Datetime` = '" + reqtime + "'AND `Workshop ID` = '" + workshop_id + "';";
    var notiQuery = "UPDATE `Notifications` SET `Seen` = '" + st + "' WHERE `Tool Code` = '" + toolcode + "' AND `Timestamp` = '" + reqtime + "' AND `Workshop ID` = '" + workshop_id + "';";
    var query = notiQuery + requestQuery;
    console.log(query);
    try {
      var rows1 = await this.executeQuery(query);
      return 1;
    }
    catch (error) {
      console.log(error);
      return 0;
    }
  }

  //workshop compliant
  async rejectIssueMultiple(toolcodearray, x, reqtime, emp_id, workshop_id) {
    var op = "issue rejected";
    var st = 1;
    var requestQuery = '';
    var notiQuery = '';
    for (var i = 0; i < toolcodearray.length; i++) {
      requestQuery = requestQuery + "UPDATE `Requests` SET `Resolve Datetime` =  '" + x + "', `Result` = '" + op + "' WHERE `Tool Code` = '" + toolcodearray[i] + "' AND `Request Datetime` = '" + reqtime + "'AND `Workshop ID` = '" + workshop_id + "' AND `Emp ID` ='" + emp_id + "';";
      // notiQuery = notiQuery + "UPDATE `Notifications` SET `Seen` = '" + st + "' WHERE `Tool Code` = '" + toolcodearray[i] + "' AND `Timestamp` = '" + reqtime + "' AND `Workshop ID` = '" + workshop_id + "' AND `Emp ID` = '" + emp_id + "';";
    }
    notiQuery = "UPDATE `Notifications` SET `Seen` = '" + st + "' WHERE `Timestamp` = '" + reqtime + "' AND `Workshop ID` = '" + workshop_id + "' AND `Emp ID` = '" + emp_id + "';";
    var query = notiQuery + requestQuery;
    console.log(query);
    try {
      var rows1 = await this.executeQuery(query);
      return 1;
    }
    catch (error) {
      console.log(error);
      return 0;
    }
  }

  //workshop compliant
  async issueTools(toolcode, toolname, reqid, x, y, fname, lname, reqtime, workshop_id) {
    var op = "issued";
    var st = 1;
    //var notiQuery = " INSERT INTO `Notifications` (`Operation`, `First Name`, `Last Name`, `Tool Name`, `Timestamp`) values " 
    var notiQuery = "UPDATE `Notifications` SET `Seen` = '" + st + "', `Operation` = '" + op + "' WHERE `Tool Code` = '" + toolcode + "' AND `Timestamp` = '" + reqtime + "' AND `Workshop ID` = '" + workshop_id + "';";
    var issueQuery = "INSERT INTO `Issue History`(`Emp ID`, `First Name`, `Last Name`, `Tool Name`, `Tool Code`, `Issue DateTime`, `Expected Return DateTime`, `Workshop ID`) VALUES ";
    var st = 1;
    issueQuery = issueQuery + "(" + "'" + reqid + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'" + toolname + "'" + "," + "'" + toolcode + "'" + "," + "'" + x + "'" + "," + "'" + y + "'" + ",'" + workshop_id + "');";
    var updateQuery = "UPDATE `Tools` SET `Allocated To`= '" + reqid + "', `Status`='" + st + "' WHERE `Tool Code` ='" + toolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
    //notiQuery = notiQuery +  "(" + "'"+op+"'"+"," + "'"+fname+"'"+","+ "'"+lname+"'"+","+ "'"+toolname+"'"+ "," + "'"+x+"'"+ ");";AND `Workshop ID` = '" + workshop_id + "';";
    var requestQuery = "UPDATE `Requests` SET `Resolve Datetime` =  '" + x + "', `Result` = '" + op + "' WHERE `Tool Name` = '" + toolname + "' AND `Request Datetime` = '" + reqtime + "' AND `Workshop ID` = '" + workshop_id + "';";
    var query = issueQuery + updateQuery + requestQuery;
    console.log(query);
    try {
      var rows1 = await this.executeQuery(query);
      return 1;
    }
    catch (error) {
      console.log(error);
      return 0;
    }
  }

  async issueMaterials(toolcode, toolname, emp_id, x, qty, fname, lname, workshop_id) {
    var issueQuery = "INSERT INTO `Issue History`(`Emp ID`, `First Name`, `Last Name`, `Tool Name`, `Tool Code`, `Issue DateTime`, `Quantity`, `Workshop ID`) VALUES ";
    issueQuery = issueQuery + "(" + "'" + emp_id + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'" + toolname + "'" + "," + "'" + toolcode + "'" + "," + "'" + x + "'" + "," + "'" + qty + "'" + ",'" + workshop_id + "');";
    var query = issueQuery;
    console.log(query);
    try {
      var rows1 = await this.executeQuery(query);
      return 1;
    }
    catch (error) {
      console.log(error);
      return 0;
    }
  }
  //workshop compliant
  async getSurrenderRequests(workshop_id) {
    var op = "surrendered";
    var moment = require('moment-timezone');
    var x = moment();
    x = x.format("YYYY-MM-DD HH:mm:ss").toString();
    var query = "SELECT * FROM `Requests` where `Operation` = '" + op + "' AND `Workshop ID` = '" + workshop_id + "';";
    try {
      var rows = await this.executeQuery(query);
      //console.log(rows);
    }
    catch (error) {
      console.log(error);
      return;
    }
    return rows;
  }
  //workshop compliant
  async getNewUserRequests(workshop_id) {
    var op = "signup request";

    var query = "SELECT * FROM `Requests` where `Operation` = '" + op + "' and `Workshop ID` = '" + workshop_id + "';";
    try {
      var rows = await this.executeQuery(query);
    }
    catch (error) {
      console.log(error);
      return null;
    }
    return rows;
  }
  //workshop compliant
  async surrenderRequest(toolname, toolcode, emp_id, x, fname, lname, workshop_id) {
    var op = "surrendered";
    var query = "INSERT INTO `Requests`(`Emp ID`, `First Name`, `Last Name`, `Operation`, `Tool Name`, `Tool Code`, `Request DateTime`, `Workshop ID`) VALUES (" + "'" + emp_id + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'" + op + "'" + "," + "'" + toolname + "'" + "," + "'" + toolcode + "'" + "," + "'" + x + "'" + "," + "'" + workshop_id + "')";
    try {
      var rows1 = await this.executeQuery(query);
    }
    catch (error) {
      console.log(error);
      return 0;
    }
    return 1;
  }
  //workshop compliant
  async requestIssue(cartItems, emp_id, x, fname, lname, workshop_id) {
    var op = "requested issue of";
    var notiQuery = " INSERT INTO `Notifications` (`Emp ID`, `Operation`, `First Name`, `Last Name`, `Tool Name`, `Tool Code`, `Timestamp`, `Workshop ID`) values ";
    var issueRequest = "INSERT INTO `Requests`(`Emp ID`, `First Name`, `Last Name`, `Operation`, `Tool Name`, `Tool Code`, `Request DateTime`, `Workshop ID`) VALUES ";
    for (var i = 0; i < cartItems.length; i++) {
      if (i != cartItems.length - 1) {
        if(cartItems[i]["permanent"] == 6)
        {
          issueMaterials(cartItems[i].id, cartItems[i].name, emp_id, x, cartItems[i].quantity, fname, lname, workshop_id);
        }
        else 
        {
          issueRequest = issueRequest + "(" + "'" + emp_id + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'" + op + "'" + "," + "'" + cartItems[i].name + "'" + "," + "'" + cartItems[i].id + "'" + "," + "'" + x + "'" + "," + "'" + workshop_id + "'),";
          notiQuery = notiQuery + "(" + "'" + emp_id + "'" + "'" + op + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'" + cartItems[i].name + "'" + "," + "'" + cartItems[i].id + "'" + "," + "'" + x + "'" + "," + "'" + workshop_id + "'),";
        }
      }
      else {
        if(cartItems[i]["permanent"] == 6)
        {
          issueMaterials(cartItems[i].id, cartItems[i].name, emp_id, x, cartItems[i].quantity, fname, lname, workshop_id)
        }
        else 
        {
          issueRequest = issueRequest + "(" + "'" + emp_id + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'" + op + "'" + "," + "'" + cartItems[i].name + "'" + "," + "'" + cartItems[i].id + "'" + "," + "'" + x + "'" + "," + "'" + workshop_id + "');";
          notiQuery = "INSERT INTO `Notifications` (`Emp ID`, `Operation`, `First Name`, `Last Name`, `Tool Name`, `Timestamp`, `Workshop ID`) values ('" + emp_id + "'" + "," + "'" + op + "'" + "," + "'" + fname + "'" + "," + "'" + lname + "'" + "," + "'various tools'" + "," + "'" + x + "'" + "," + "'" + workshop_id + "');";
        }
      }
    }
    var query = issueRequest + notiQuery;
    console.log(query);
    try {
      var rows1 = await this.executeQuery(query);
    }
    catch (error) {
      console.log(error);
      return 0;
    }
    return 1;
  }
  //workshop compliant
  async getSimilarTools(toolname, workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Tool Code`, `Tool Name` FROM `Tools` where `Tool Name`='" + toolname + "' AND `Workshop ID` = '" + workshop_id + "';");
      //console.log(rows);
      return rows;
    }
    catch{
      console.log("Error in getSimilarTools");
    }
  }

  // workshop compliant
  async verifyLogin(emp_id, password) {
    console.log("verify login");
    try {
      var rows = await this.executeQuery("SELECT * FROM Technicians where `Emp ID`= '" + emp_id + "' or `Email` = '" + emp_id + "';");
      if (rows.length > 0 && rows[0].Password == password && rows[0].Authorised == 1) {
        console.log(rows);
        console.log("Manager");
        return [1, rows[0]["Emp ID"]];
      }
      else if (rows.length > 0 && rows[0].Password == password && rows[0].Authorised == 2) {
        console.log("Issuer Portal");
        console.log(rows);
        return [5, rows[0]["Emp ID"]];
      }
      else if (rows.length > 0 && rows[0].Password == password) {
        console.log("Technician");
        return [2, rows[0]["Emp ID"]];
      }
      else if (rows.length > 0) {
        console.log("incorrect password");
        return [3, ''];
      }
      else {
        console.log("no user found");
        return [4, ''];
      }
    }
    catch
    {
      console.log("Please try again!");
    }

  }
  //workshop compliant
  async registerUser(fname, lname, desg, email, id, company, contactno, dob, password, emp_id, wid) {
    //console.log(fname + lname);
    // console.log(company);
    try {
      var query = "INSERT INTO `Technicians` (`First Name`, `Last Name`, `Designation`, `Email`, `Emp ID`, `Company`, `Contact Number`, `DOB`, `Password`, `Reference`, `Workshop ID`) values('" + fname + "','" + lname + "','" + desg + "','" + email + "','" + id + "','" + company + "','" + contactno + "','" + dob + "','" + password + "','" + emp_id + "','" + wid + "')";
      console.log(query);
      var row = await this.executeQuery(query);
      return 1;
    }
    catch
    {
      console.log("Please try again!");
      return 0;
    }
  }
  //workshop compliant
  async updateSignUpRequest(emp_id, result, workshop_id) {
    var moment = require('moment-timezone');
    var x = moment();
    x = x.format("YYYY-MM-DD HH:mm:ss").toString();
    var query = "UPDATE `Requests` SET `Result`='" + result + "', `Resolve Datetime`='" + x + "' where `Emp ID`='" + emp_id + "' AND `Workshop ID` = '" + workshop_id + "';";
    try {
      var row = await this.executeQuery(query);
      return 1;
    }
    catch
    {
      console.log("error in updateSignUpRequest.");
      return 0;
    }
  }
  // workshop compliant
  async updateProfile(fname, lname, desg, email, id, contactno, dob, update_empid) {
    var query = "UPDATE `Technicians` SET `First Name`='" + fname + "', `Last Name`='" + lname + "', `Designation`='" + desg + "', `Email`='" + email + "', `Contact Number`='" + contactno + "', `DOB`='" + dob + "' where `Emp ID`='" + update_empid + "' ";
    console.log(query);
    try {
      var row = await this.executeQuery(query);
      return 1;
    }
    catch
    {
      console.log("Please try again!");
      return 0;
    }
  }
  //workshop compliant
  async removeEmployee(update_empid, workshop_id) {
    var query = "DELETE FROM `Technicians` where `Emp ID`='" + update_empid + "' AND `Workshop ID` = '" + workshop_id + "';";
    console.log(query);
    try {
      var row = await this.executeQuery(query);
      return 1;
    }
    catch
    {
      console.log("Please try again!");
      return 0;
    }
  }

  //workshop compliant
  async removeTool(modifyToolcode, workshop_id) {
    var query = "DELETE FROM `Tools` where `Tool Code`='" + modifyToolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
    query += "DELETE FROM `Tools` where `Part Of Kit`='" + modifyToolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
    //console.log(query);
    try {
      var row = await this.executeQuery(query);
      return 1;
    }
    catch
    {
      console.log("Please try again!");
      return 0;
    }
  }

  //workshop compliant
  async notifyToolStatus(cause, toolname, toolcode, emp_id, fname, lname, workshop_id) {
    var op = cause;
    var moment = require('moment-timezone');
    var x = moment();
    x = x.format("YYYY-MM-DD HH:mm:ss").toString();
    var query = "INSERT INTO `Notifications` (`Tool Name`,`Tool Code`, `Emp ID`, `First Name`, `Last Name`, `Operation`, `Timestamp`, `Workshop ID`) values ('" + toolname + "','" + toolcode + "', '" + emp_id + "', '" + fname + "', '" + lname + "', '" + op + "', '" + x + "', '" + workshop_id + "')";
    console.log(query);
    try {
      var row = await this.executeQuery(query);
      return 1;
    }
    catch
    {
      console.log("Error in notifyToolStatus! Please try again!");
      return 0;
    }
  }

  //workshop compliant
  async transferTools(from, to, toollist, workshop_id) {
    console.log("transfer Tools");
    var query = "";
    for (var i = 0; i < toollist.length; i++) {
      query = query + "UPDATE `Tools` SET `Allocated To` = '" + to + "' where `Allocated To` = '" + from + "' AND `Permanent` = '1' AND `Tool Code` = '" + toollist[i] + "' AND `Workshop ID` = '" + workshop_id + "';";
    }
    console.log(query);
    try {

      var row = await this.executeQuery(query);
      return 1;
    }
    catch
    {
      console.log("Please try again!");
      return 0;
    }
  }
  // async issueTools(cartItems, emp_id) {    (`First Name`, `Last Name`, `Designation`, )


  //     var moment = require('moment-timezone');
  //     var x = moment();
  //     x = x.format("YYYY-MM-DD HH:mm:ss").toString();
  //     var deductQtyQuery = "";
  //     var query = "INSERT INTO `Issue History`(`Emp ID`, `Tool Name`, `Tool Code`, `Issue Quantity`, `Return Quantity`, `Issue DateTime`) VALUES ";
  //     for(var i=0; i<cartItems.length;i++){
  //       if(i!= cartItems.length -1){
  //         query = query + "(" + "'"+emp_id +"'"+","+ "'"+cartItems[i].name+"'"+ ","+"'"+ cartItems[i].id + "'"+"," + "'"+cartItems[i].quantity+"'"+"," +"0" +"," +"'"+x +"'"+ "),";
  //         deductQtyQuery = deductQtyQuery + "UPDATE `Tools` SET `Quantity`=`Quantity`-" + "'"+cartItems[i].quantity+"'" + "WHERE `TOOL Code` =" + "'"+ cartItems[i].id + "'" + ";";
  //       }
  //       else{
  //         query = query + "(" + "'"+emp_id + "'"+","+ "'"+cartItems[i].name +"'"+ ","+"'"+ cartItems[i].id + "'"+"," + "'"+cartItems[i].quantity +"'"+"," +"0" +"," + "'"+x +"'"+ ");";
  //         deductQtyQuery = deductQtyQuery + "UPDATE `Tools` SET `Quantity`=`Quantity`-" + "'"+cartItems[i].quantity+"'" + "WHERE `TOOL Code` =" + "'"+ cartItems[i].id + "'" + ";";

  //       }
  //     }

  //     try{
  //       var rows1 = await this.executeQuery(query);
  //       try{
  //         var rows2 = await this.executeQuery(deductQtyQuery);
  //       }
  //       catch{
  //         // write query to rollback.
  //         var rows3 = await this.executeQuery("DELETE FROM `Issue History` ORDER by `Issue DateTime` DESC limit " + cartItems.length.toString()+ ";");
  //         return 0;
  //       }

  //       }
  //       catch(error){
  //         console.log(error);
  //         return 0;
  //       }
  //       return 1;


  // }

  //workshop compliant
  async getNotifications(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT * FROM `Notifications` where `Seen` = 0 AND `Workshop ID` = '" + workshop_id + "' ORDER BY `Timestamp` DESC");
      return rows;
    }
    catch{
      console.log("Error in getNotifications");
    }
  }

  //workshop compliant
  async getQuantity(toolname, workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) as quan FROM `Tools` where `Tool Name`='" + toolname + "' AND `Workshop ID` = '" + workshop_id + "';");
      //console.log(rows);
      return rows;
    }
    catch{
      console.log("Error in getQuantity");
    }
  }
  async getMaterialQuantity(toolcode, workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Quantity` FROM `Tools` where `Tool Code`='" + toolcode + "' AND `Workshop ID` = '" + workshop_id + "';");
      //console.log(rows);
      return rows;
    }
    catch{
      console.log("Error in getMaterialQuantity");
    }
  }

  //workshop compliant
  async getAllRecordsForAToolID(toolcode, workshop_id) {
    try {
      var query = "SELECT * FROM `Repair History` where `Tool Code`='" + toolcode + "' AND `Workshop ID` = '" + workshop_id + "' ORDER BY `Report Datetime` DESC;";
      // console.log(query);
      var rows = await this.executeQuery(query);
      return rows;
    }
    catch{
      console.log("Error in getAllRecordsForAToolID");
    }
  }

  //workshop compliant
  async getSpecialTools(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT * FROM Tools where `Permanent`= 0 AND `Part Of Kit` IS NULL AND `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch {
      console.log("Error in getSpecialTools");
    }
  }
  //workshop compliant
  async getMaxToolCode(tname, workshop_id) {
    console.log("get max function");
    try {
      console.log("service tryyy");
      var query = "Select MAX(`Tool Code`) as maxtcode from `Tools` where `Tool Name` = '" + tname + "' AND `Workshop ID` = '" + workshop_id + "';";
      console.log(query);
      rows = await this.executeQuery(query);
      return rows;
    }
    catch {
      console.log("Error in getMaxToolCode");
      return 0;
    }
  }
  //workshop compliant
  async getHandTools(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT * FROM Tools where `Permanent`= 1 AND `Part Of Kit` IS NULL AND `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch {
      console.log("Error in getHandTools");
    }
  }


  // async getSelectedRequests(requestRegisterName, requestRegisterToolname, requestRegisterSd, requestRegisterEd) {
  //   var query = "SELECT * FROM `Requests` where ";
  //   if (requestRegisterName) { query += "(`First Name` LIKE '%" + requestRegisterName + "%'"; }
  //   else { query += "(`First Name` IS NOT NULL"; }

  //   if (requestRegisterName) { query += " OR `Last Name` LIKE '%" + requestRegisterName + "%')"; }
  //   else { query += " OR `Last Name` IS NOT NULL)"; }


  //   if (requestRegisterToolname) { query += " AND `Tool Name` LIKE '%" + requestRegisterToolname + "%'"; }
  //   else { query += " AND `Tool Name` IS NOT NULL"; }
  //   if (requestRegisterSd) { query += " AND `Report Datetime` > '" + requestRegisterSd + "'"; }
  //   else { query += " AND `Request Datetime` IS NOT NULL"; }
  //   if (requestRegisterEd) { query += " AND `Report Datetime` <= '" + requestRegisterEd + "'"; }
  //   else { query += " AND `Request Datetime` IS NOT NULL"; }
  //   query += " ORDER BY `Request Datetime` DESC";
  //   console.log(query);
  //   var rows = await this.executeQuery(query);

  //   //var rows = await this.executeQuery("SELECT * FROM `Issue History` where `Emp ID`='"+issueHistoryId+"'");
  //   return rows;
  // }

  //workshop compliant
  async getNoOfTools(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) as totaltools FROM `Tools` where `Part Of Kit` IS NULL AND `Permanent` < 2 AND `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getNoOfTools");
    }
  }

  //workshop compliant
  async getNoOfIssues(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) as totalissues FROM `Issue History` where `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getNoOfIssues");
    }
  }

  //workshop compliant
  async getNoOfReports(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) as totalreports FROM `Repair History` where `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getNoOfReports");
    }
  }

  //workshop compliant
  async getNoOfPendingReturns(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) as totalpending FROM `Issue History` where `Return DateTime` IS NULL and `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getNoOfPendingReturns");
    }
  }

  //workshop compliant
  async getAllTools(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT * FROM `Tools` where `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch{
      console.log("Error in getAllTools");
    }
  }

  //workshop compliant
  async getMyTools(emp_id, workshop_id) {
    try {
      var query = "SELECT * FROM Tools where `Allocated To`='" + emp_id + "' AND `Permanent`=1 AND `Workshop ID` = '" + workshop_id + "';";
      var rows = await this.executeQuery(query);
      // console.log(query +  " " + rows);
      return rows;
    }
    catch{
      console.log("Error in getMyTools");
    }
  }

  async getIssuedTools(emp_id, workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT * FROM `Issue History` where `Emp ID`='" + emp_id + "' and `Return DateTime` IS NULL AND `Workshop ID` = '" + workshop_id + "';");
      return rows;
    }
    catch {
      console.log("Error in getIssuedTools");
    }
  }

  //workshop Compliant
  async getAllPending(workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT * FROM `Issue History` where `Return DateTime` IS NULL AND `Workshop ID` = '" + workshop_id + "' order by `Issue DateTime` desc");
      return rows;
    }
    catch {
      console.log("Error in getAllPending");
    }
  }

  //workshop compliant
  async getIssuedCount(emp_id, workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) FROM `Issue History` where `Emp ID`='" + emp_id + "' AND `Workshop ID` = '" + workshop_id + "';");
      //console.log(rows);
      rows = rows[0]["count(*)"];
      return rows;
    }
    catch {
      console.log("Error in getIssuedCount");
    }
  }

  //workshop compliant
  async getCurrentToolsCount(emp_id, workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT count(*) FROM `Tools` where `Allocated To`='" + emp_id + "' AND `Workshop ID` = '" + workshop_id + "';");
      console.log(rows);
      rows = rows[0]["count(*)"];
      return rows;
    }
    catch {
      console.log("Error in getIssuedCount");
    }
  }

  //workshop compliant
  async getToolProfile(toolcode, workshop_id) {
    // console.log("getToolProfile called");
    var query = ("SELECT * FROM Tools where `Tool Code`='" + toolcode + "' AND `Workshop ID` = '" + workshop_id + "';");
    // console.log(query);
    var rows = await this.executeQuery(query);
    return rows;
  }

  //workshop compliant
  async getUserDetails(email) {
    var rows = await this.executeQuery("SELECT * FROM Technicians where Email= '" + email + "'");
    return rows;
  }

  //workshop compliant
  async getUserDetailsFromEmpID(emp_id) {
    var rows = await this.executeQuery("SELECT * FROM Technicians where `Emp ID`= '" + emp_id + "'");
    return rows;
  }

  //workshop compliant 
  async getUserDetailsFromEmpIDorEmail(emp_id, email) {
    var rows = await this.executeQuery("SELECT * FROM Technicians where `Emp ID`= '" + emp_id + "' or `Email` = '" + email + "';");
    if (rows.length == 1) {
      return rows[0];
    }
    else {
      return 0;
    }
  }

  //workshop compliant 
  async getScore(emp_id) {
    var totalIssues = await this.executeQuery("select count(*) from `Issue History` where `Emp ID` = '" + emp_id + "'");
    totalIssues = totalIssues[0]["count(*)"];
    var successIssues = await this.executeQuery("select count(*) from `Issue History` where `Emp ID` = '" + emp_id + "' AND `Return DateTime` <= `Expected Return DateTime`");
    successIssues = successIssues[0]["count(*)"];
    var score = successIssues * 100 / totalIssues;
    return score;
  }

  //workshop compliant 
  async authorise(emp, auth) {
    await this.executeQuery("UPDATE Technicians SET `Authorised` = '" + auth + "' where `Emp ID` = '" + emp + "' ");
  }

  //workshop compliant 
  async changePassword(emp, newPassword) {
    console.log(emp, newPassword);
    try {
      await this.executeQuery("UPDATE Technicians SET `Password` = '" + newPassword + "' where `Emp ID` = '" + emp + "' ");
      return 1;
    }
    catch{
      return 0;
      console.log("An error occurred in changePassword() service-layer");
    }
  }

  //workshop compliant 
  async getCurrentLogin(empid) {
    var rows = await this.executeQuery("SELECT `Last Login Date` FROM Technicians where `Emp ID`= '" + empid + "'");
    return rows;
  }

  //workshop compliant 
  async setCurrentLogin(curLogin, empid) {
    var rows = await this.executeQuery("UPDATE Technicians SET `Last Login Date`='" + curLogin + "' where `Emp ID` = '" + empid + "'");
    return rows;
  }

  //workshop compliant 
  async getIssueHistory(empid, workshop_id) {
    //var rows = await this.executeQuery("SELECT * FROM `Issue History` where `Emp ID`='" + empid + "' ORDER BY `Issue DateTime` DESC");
    var query1 = "SELECT * FROM `Issue History` WHERE `Emp ID`='" + empid + "' AND `Return Datetime` IS NULL AND `Workshop ID` = '" + workshop_id + "' Order by `Issue Datetime` DESC;";
    var query2 = "SELECT * FROM `Issue History` WHERE `Emp ID`='" + empid + "' AND `Return Datetime` IS NOT NULL AND `Workshop ID` = '" + workshop_id + "' Order by `Issue Datetime` DESC";
    var rows1 = await this.executeQuery(query1);
    var rows2 = await this.executeQuery(query2);
    var rows = rows1.concat(rows2);
    console.log(query1 + " " + query2);
    return rows;
  }
  //select * from `Repair History` order by case when `Resolve Datetime` is null then 0 else 1 end, `Resolve Datetime`
  //workshop compliant
  async getIssueRequests(workshop_id) {
    var op = "requested issue of";
    var rows1 = await this.executeQuery("SELECT * FROM `Requests` where `Resolve Datetime` IS NULL AND `Operation` = '" + op + "' AND `Workshop ID` = '" + workshop_id + "' Order by `Request Datetime` DESC;");
    var rows2 = await this.executeQuery("SELECT * FROM `Requests` where `Resolve Datetime` IS NOT NULL AND `Operation` = '" + op + "' AND `Workshop ID` = '" + workshop_id + "' Order by `Request Datetime` DESC");
    var rows = rows1.concat(rows2);
    return rows;
  }

  //workshop compliant
  async getSelectedRequest(id, empid, workshop_id) {
    var rows = await this.executeQuery("SELECT * FROM `Requests` where `Resolve Datetime` IS NULL AND `Tool Code`='" + id + "' AND `Emp ID`='" + empid + "' AND `Workshop ID` = '" + workshop_id + "';");
    return rows;
  }

  //workshop compliant
  async getPendingRequests(workshop_id) {
    var op = "requested issue of";
    var rows = await this.executeQuery("SELECT * FROM `Requests` WHERE `Resolve Datetime` IS NULL AND `Operation` = '" + op + "' AND `Workshop ID` = '" + workshop_id + "' ORDER BY `Request DateTime` DESC");
    return rows;
  }

  //workshop compliant
  async getRepairHistory(workshop_id) {
    var rows1 = await this.executeQuery("SELECT * FROM `Repair History` WHERE `Resolve Datetime` IS NULL AND `Workshop ID` = '" + workshop_id + "' Order by `Report Datetime` DESC;");
    var rows2 = await this.executeQuery("SELECT * FROM `Repair History` WHERE `Resolve Datetime` IS NOT NULL AND `Workshop ID` = '" + workshop_id + "' Order by `Report Datetime` DESC");
    var rows = rows1.concat(rows2);
    return rows;
  }

  //workshop compliant
  async getSelectedRepairHistory(repairHistoryId, repairHistoryToolcode, repairHistorySd, repairHistoryEd, workshop_id) {
    var query = "SELECT * FROM `Repair History` where `Workshop ID` = '" + workshop_id + "'";
    if (repairHistoryId) { query += "AND `Emp ID` = '" + repairHistoryId + "'"; }
    else { query += "AND `Emp ID` IS NOT NULL"; }
    if (repairHistoryToolcode) { query += " AND `Tool Code` = '" + repairHistoryToolcode + "'"; }
    else { query += " AND `Tool Code` IS NOT NULL"; }
    if (repairHistorySd) { query += " AND `Report Datetime` > '" + repairHistorySd + "'"; }
    else { query += " AND `Report Datetime` IS NOT NULL"; }
    if (repairHistoryEd) { query += " AND `Report Datetime` <= '" + repairHistoryEd + "'"; }
    else { query += " AND `Report Datetime` IS NOT NULL"; }
    query += " ORDER BY `Report Datetime` DESC";
    console.log(query);
    var rows = await this.executeQuery(query);

    //var rows = await this.executeQuery("SELECT * FROM `Issue History` where `Emp ID`='"+issueHistoryId+"'");
    return rows;
  }

  //workshop compliant
  async getTotalIssueHistory(workshop_id) {
    var rows1 = await this.executeQuery("SELECT * FROM `Issue History` WHERE `Return Datetime` IS NULL AND `Workshop ID` = '" + workshop_id + "' Order by `Issue Datetime` DESC;");
    var rows2 = await this.executeQuery("SELECT * FROM `Issue History` WHERE `Return Datetime` IS NOT NULL AND `Workshop ID` = '" + workshop_id + "' Order by `Issue Datetime` DESC");
    var rows = rows1.concat(rows2);
    return rows;
  }
  //workshop compliant
  async getSelectedIssueHistory(issueHistoryId, issueHistoryToolcode, issueHistorySd, issueHistoryEd, workshop_id) {
    var query = "SELECT * FROM `Issue History` where `Workshop ID` = '" + workshop_id + "'";
    if (issueHistoryId) { query += " AND `Emp ID` LIKE '" + issueHistoryId + "'"; }
    else { query += " AND `Emp ID` IS NOT NULL"; }
    if (issueHistoryToolcode) { query += " AND `Tool Code` LIKE '%" + issueHistoryToolcode + "%'"; }
    else { query += " AND `Tool Code` IS NOT NULL"; }
    if (issueHistorySd) { query += " AND `Issue DateTime` > '" + issueHistorySd + "'"; }
    else { query += " AND `Issue DateTime` IS NOT NULL"; }
    if (issueHistoryEd) { query += " AND `Issue DateTime` <= '" + issueHistoryEd + "'"; }
    else { query += " AND `Issue DateTime` IS NOT NULL"; }
    query += " ORDER BY `Issue DateTime` DESC";

    //console.log(query);
    var rows = await this.executeQuery(query);

    //var rows = await this.executeQuery("SELECT * FROM `Issue History` where `Emp ID`='"+issueHistoryId+"'");
    return rows;
  }

  async returnAllTools(emp_id, workshop_id)
  {
    var moment = require('moment-timezone');
    var x = moment();
    x = x.format("YYYY-MM-DD HH:mm:ss").toString();
    var returnAllquery = "UPDATE `Issue History` SET `Return DateTime`='" + x + "' where `Emp ID`='" + emp_id + "' AND `Workshop ID` = '" + workshop_id + "'; UPDATE `Tools` SET Status = 0, `Allocated To` = NULL WHERE `Allocated To` = '" + emp_id + "' AND `Workshop ID` = '" + workshop_id + "';";
    var rows1 = await this.executeQuery(returnAllquery);
      // console.log(rows1);                 
      return 1;
  }

  //workshop compliant
  async returnTools(empid, toolcode, issuedt, cause, workshop_id) {

    var moment = require('moment-timezone');
    var x = moment();
    x = x.format("YYYY-MM-DD HH:mm:ss").toString();

    var y = moment(new Date(issuedt));
    y = y.format("YYYY-MM-DD HH:mm:ss").toString();

    try {
      var returnquery = "UPDATE `Issue History` SET `Return DateTime`='" + x + "', `Return Status` = '"+ cause +"' where `Emp ID`='" + empid + "' AND `Tool Code` = '" + toolcode + "' AND `Issue DateTime` ='" + y + "' AND `Workshop ID` = '" + workshop_id + "'; UPDATE `Tools` SET Status = 0, `Allocated To` = NULL WHERE `Tool Code` = '" + toolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      console.log(returnquery);      
      var rows1 = await this.executeQuery(returnquery);
      // console.log(rows1);                 
      return 1;
    }

    //QUANTITY CODE
    // try
    // {  
    //   var returnquery = "UPDATE `Issue History` SET `Return DateTime`='"+x+"',`Return Quantity`= `Return Quantity` +"+rquantity+ " where `Emp ID`='"+empid+"' AND `Tool Code` = '"+toolcode+"' AND `Issue DateTime` ="+"'"+ y +"'"+"; UPDATE `Tools` SET Quantity = Quantity +'"+rquantity+"' WHERE `Tool Code` = '"+toolcode+"'" ;
    //   console.log(returnquery);      
    //   var rows1 = await this.executeQuery(returnquery);
    //    // console.log(rows1);
    //     return 1;
    // }
    catch{
      console.log("Error in returnTools")
      return 0;
    }
  }


  //workshop compliant
  async resolveTool(reptime, x, cost, action, toolcode, totalcost, workshop_id) {
    var z = moment();
    z = z.format("YYYY-MM-DD").toString();
    var st = 0;
    var query = "UPDATE `Repair History` SET `Resolve Datetime`='" + x + "', `Cost`='" + cost + "', `Action`='" + action + "' where `Tool Code` = '" + toolcode + "' AND `Report Datetime` = '" + reptime + "' AND `Workshop ID` = '" + workshop_id + "';";
    if(action == "replaced")
      query += "Update `Tools` SET `Status`= '" + st + "',`Maintenance Cost` = '" + totalcost + "', `Date of Purchase` = '" + z + "' where `Tool Code` = '" + toolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
    else
      query += "Update `Tools` SET `Status`= '" + st + "',`Maintenance Cost` = '" + totalcost + "' where `Tool Code` = '" + toolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      console.log(query);
    try {
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch {
      console.log("Error in resolveTool");
      return 0;
    }
  }

  //workshop compliant
  async selectedToolCode(selectedToolCode, workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Tool Name`, `Status` FROM `Tools` where `Part Of Kit`='" + selectedToolCode + "' AND `Workshop ID` = '" + workshop_id + "' ORDER BY `Tool Code` DESC");
      return rows;
    }
    catch {
      console.log("Error in selectedToolCode");
      return 0;
    }
  }

  async getChildParts(selectedToolCode, workshop_id) {
    try {
      var rows = await this.executeQuery("SELECT `Tool Code`,`Tool Name`, `Status` FROM `Tools` where `Part Of Kit`='" + selectedToolCode + "' AND `Workshop ID`='" + workshop_id + "' ORDER BY `Tool Code` DESC");
      return rows;
    }
    catch {
      console.log("Error in getChildParts");
      return 0;
    }
  }

  //workshop compliant
  async setChildParts(childPartReport, selectedToolCode, workshop_id) {
    for (var i = 0; i < childPartReport.length; i++) {
      tname = childPartReport[i].name;
      status = childPartReport[i].status;
      try {
        var rows = await this.executeQuery("UPDATE `Tools` SET `Status` = '" + status + "' where `Tool Name`='" + tname + "' AND `Part Of Kit`='" + selectedToolCode + "' AND `Workshop ID` = '" + workshop_id + "';");
        return 1;
      }
      catch {
        console.log("Error in setChildParts");
        return 0;
      }
    }
  }

  // async returnAndReport(selectedToolCode, emp_id, cause, reportText, status, x, y) {
  //   var z = moment();
  //   z = z.format("YYYY-MM-DD").toString();

  //   try {
  //     var returnquery = "UPDATE `Issue History` SET `Return DateTime`='" + x + "' where `Emp ID`='" + empid + "' AND `Tool Code` = '" + toolcode + "' AND `Issue DateTime` ='" + y + "'; UPDATE `Tools` SET Status = 0, `Allocated To` = NULL, `Date of Last Modification` = '" + z + "' WHERE `Tool Code` = '" + toolcode + "';";

  //     var returnAndReportQuery = returnquery + "INSERT INTO `Repair History` (`Tool Code`, `Report Datetime`, `Emp ID`, `Cause`, `Additional Remarks`) values ('" + selectedToolCode + "', '" + x + "', '" + emp_id + "', '" + cause + "', '" + reportText + "') ; UPDATE `Tools` SET Status = '" + status + "' WHERE `Tool Code` = '" + selectedToolCode + "'";
  //     console.log(returnAndReportQuery);
  //     var rows = await this.executeQuery(returnAndReportQuery);
  //     //console.log(rows);
  //     return 1;
  //     //UPDATE `Issue History` SET `Report`='"+reportText+"' where `Issue DateTime` = '"+y+"' AND `Tool Code` = '"+selectedToolCode+"';
  //   }

  //   catch {
  //     console.log("Error in returnAndReport");
  //     return 0;
  //   }
  // }

  //workshop compliant
  async sendReport(selectedToolCode, emp_id, fname, lname, cause, reportText, status, toolname, workshop_id) {
    var moment = require('moment-timezone');
    var x = moment();
    x = x.format("YYYY-MM-DD HH:mm:ss").toString();
    var z = moment();
    z = z.format("YYYY-MM-DD").toString();
    var op = "reported";
    var reportQuery = "INSERT INTO `Repair History` (`Tool Code`, `Tool Name`, `Report Datetime`, `Emp ID`, `First Name`, `Last Name`, `Cause`, `Additional Remarks`, `Workshop ID`) values ('" + selectedToolCode + "', '" + toolname + "', '" + x + "', '" + emp_id + "', '" + fname + "', '" + lname + "', '" + cause + "', '" + reportText + "', '" + workshop_id + "') ; UPDATE `Tools` SET Status = '" + status + "', `Date of Last Modification` = '" + z + "' WHERE `Tool Code` = '" + selectedToolCode + "' AND `Workshop ID` = '" + workshop_id + "'; INSERT INTO `Notifications` (`Tool Code`, `Tool Name`,`Emp ID`, `First Name`, `Last Name`, `Operation`, `Timestamp`, `Workshop ID`) values ('" + selectedToolCode + "', '" + toolname + "', '" + emp_id + "', '" + fname + "', '" + lname + "', '" + op + "', '" + x + "', '" + workshop_id + "')";
    console.log(reportQuery);
    try {
      var rows = await this.executeQuery(reportQuery);

      return 1;
      //UPDATE `Issue History` SET `Report`='"+reportText+"' where `Issue DateTime` = '"+y+"' AND `Tool Code` = '"+selectedToolCode+"';
    }
    catch {
      console.log("Error in sendReport");
      return 0;
    }
  }
  async skipMaintenance(selectedToolCode, toolname, cause, reportText, emp_id, fname, lname, workshop_id) {
    var moment = require('moment-timezone');
    var x = moment();
    x = x.format("YYYY-MM-DD HH:mm:ss").toString();
    var z = moment();
    z = z.format("YYYY-MM-DD").toString();
    var action = "NA";
    // var status = 0;
    var reportQuery = "INSERT INTO `Repair History` (`Tool Code`, `Tool Name`, `Report Datetime`, `Resolve Datetime`, `Cause`, `Emp ID`, `First Name`, `Last Name`, `Action`, `Additional Remarks`, `Workshop ID`) values ('" + selectedToolCode + "', '" + toolname + "', '" + x + "', '" + x + "', '" + cause + "', '" + emp_id + "', '" + fname + "', '" + lname + "', '" + action + "',  '" + reportText + "', '" + workshop_id + "') ; UPDATE `Tools` SET `Date of Last Modification` = '" + z + "', `Date of Last Maintenance` = '" + z + "' WHERE `Tool Code` = '" + selectedToolCode + "' AND `Workshop ID` = '" + workshop_id + "';";
    console.log(reportQuery);
    try {
      var rows = await this.executeQuery(reportQuery);

      return 1;
      //UPDATE `Issue History` SET `Report`='"+reportText+"' where `Issue DateTime` = '"+y+"' AND `Tool Code` = '"+selectedToolCode+"';
    }
    catch {
      console.log("Error in skipMaintenance");
      return 0;
    }
  }
  async sendForMaintenance(selectedToolCode, cause, status, emp_id, fname, lname, toolname, workshop_id) {
    var moment = require('moment-timezone');
    var x = moment();
    x = x.format("YYYY-MM-DD HH:mm:ss").toString();
    var z = moment();
    z = z.format("YYYY-MM-DD").toString();
    var op = "reported";
    var maintenanceQuery = "INSERT INTO `Repair History` (`Tool Code`, `Tool Name`, `Report Datetime`, `Cause`, `Emp ID`, `First Name`, `Last Name`, `Workshop ID`) values ('" + selectedToolCode + "', '" + toolname + "', '" + x + "', '" + cause + "', '" + emp_id + "', '" + fname + "', '" + lname + "', '" + workshop_id + "') ; UPDATE `Tools` SET Status = '" + status + "', `Date of Last Modification` = '" + z + "', `Date of Last Maintenance` = '" + z + "' WHERE `Tool Code` = '" + selectedToolCode + "' AND `Workshop ID` = '" + workshop_id + "';";
    console.log(maintenanceQuery);
    try {
      var rows = await this.executeQuery(maintenanceQuery);

      return 1;
      //UPDATE `Issue History` SET `Report`='"+reportText+"' where `Issue DateTime` = '"+y+"' AND `Tool Code` = '"+selectedToolCode+"';
    }
    catch {
      console.log("Error in sendForMaintenance");
      return 0;
    }
  }
  //workshop compliant
  async deleteReport(workshop_id) {
    try {
      var rows = await this.executeQuery("Delete from `Repair History` where `Workshop ID`='" + workshop_id + "' ORDER by `Report DateTime` DESC LIMIT 1");
      return 1;
    }
    catch {
      console.log("Error in deleteReport");
      return 0;
    }
  }

  async getMaintainedTools(workshop_id) {
    try {
      var rows = await this.executeQuery("Select * from `Tools` where `Workshop ID`='" + workshop_id + "' AND `Maintenance` = '1'");
      return 1;
    }
    catch {
      console.log("Error in deleteReport");
      return 0;
    }
  }

  async addMaterial(tcode, tname, brand, value, location, description, dop, warranty_ed, quantity, unit, maintained, iif, amc, amcpro, amccon, amcpersd, amcpered, dolm, inf, permanent, workshop_id) {
    
    var query = "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Brand`, `Value`, `Location`, `Description`, `Date of Purchase`, `Warranty Enddate`, `Quantity`, `Unit`, `Maintenance`, `Internal Inspection Frequency`, `AMC`, `AMC Provider`, `AMC Contact`, `AMC Period Startdate`, `AMC Period Enddate`, `Date of Last Maintenance`, `Inspection Frequency`, `Permanent`, `Workshop ID`) values ('" + tcode + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + quantity + "', '" + unit + "', '" + maintained + "', '" + iif + "', '" + amc + "', '" + amcpro + "', '" + amccon + "', '" + amcpersd + "', '" + amcpered + "', '" + dolm + "', '" + inf + "', '" + permanent + "','" + workshop_id + "' )";
    console.log(query);
    try {
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch {
      console.log("Error in addMaterial");
      return 0;
    }
  }

  //workshop compliant
  async addTool(tcode, tname, brand, value, location, description, dop, warranty_ed, quantity, maintained, permanent, workshop_id) {
    var tcodes;
    if(value == '')
      value = 0;
    if(dop == "")
      dop = "1970-01-01";
    if(warranty_ed == "")
      warranty_ed = "1970-01-01";  
    try {
      if (quantity == 1) {
        var query = "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Brand`, `Value`, `Location`, `Description`, `Date of Purchase`,`Warranty Enddate`, `Maintenance`, `Permanent`, `Workshop ID`) values ('" + tcode + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + permanent + "'" + "," + "'" + workshop_id + "'" + ")";
      }
      else {
        var query = "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Brand`, `Value`, `Location`, `Description`, `Date of Purchase`, `Warranty Enddate`,`Maintenance`, `Permanent`, `Workshop ID`) values";
        for (var i = 1; i < quantity; i++) {
          tcodes = tcode + "/" + i;
          query += "('" + tcodes + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + permanent + "'" + "," + "'" + workshop_id + "'" + "),";
        }
        tcodes = tcode + "/" + quantity;
        query += "('" + tcodes + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + permanent + "'" + "," + "'" + workshop_id + "'" + ");";
      }
      console.log(query);
      var rows = await this.executeQuery(query);
        return 1;
    }
    catch {
      console.log("Error in addTool");
      return 0;
    }
  }

  //workshop compliant
  async addMaintainedTool(tcode, tname, brand, value, location, description, dop, warranty_ed, quantity, maintained, iif, amc, amcpro, amccon, amcpersd, amcpered, dolm, inf, permanent, workshop_id) {
    var tcodes;
    if(value == '')
      value = 0;
    if(dop == "")
      dop = "1970-01-01";
    if(warranty_ed == "")
      warranty_ed = "1970-01-01";
    if(amcpered == "")
      amcpered = "1970-01-01";
    if(amcpersd == "")
      amcpersd = "1970-01-01";
    if(dolm == "")
      dolm = "1970-01-01";

    try {
      if (quantity == 1) {
        console.log("INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Brand`, `Value`, `Location`, `Description`, `Date of Purchase`, `Warranty Enddate`, `Maintenance`, `Internal Inspection Frequency`, `AMC`, `AMC Provider`, `AMC Contact`, `AMC Period Startdate`, `AMC Period Enddate`, `Date of Last Maintenance`, `Inspection Frequency`, `Permanent`, `Workshop ID`) values ('" + tcode + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + iif + "', '" + amc + "', '" + amcpro + "', '" + amccon + "', '" + amcpersd + "', '" + amcpered + "', '" + dolm + "', '" + inf + "', '" + permanent + "'" + "," + "'" + workshop_id + "'" + ")");
        var rows = await this.executeQuery("INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Brand`, `Value`, `Location`, `Description`, `Date of Purchase`, `Warranty Enddate`, `Maintenance`, `Internal Inspection Frequency`, `AMC`, `AMC Provider`, `AMC Contact`, `AMC Period Startdate`, `AMC Period Enddate`, `Date of Last Maintenance`, `Inspection Frequency`, `Permanent`, `Workshop ID`) values ('" + tcode + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + iif + "', '" + amc + "', '" + amcpro + "', '" + amccon + "', '" + amcpersd + "', '" + amcpered + "', '" + dolm + "', '" + inf + "', '" + permanent + "'" + "," + "'" + workshop_id + "'" + ")");
        return 1;
      }
      else {
        var query = "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Brand`, `Value`, `Location`, `Description`, `Date of Purchase`, `Warranty Enddate`, `Maintenance`, `Internal Inspection Frequency`, `AMC`, `AMC Provider`, `AMC Contact`, `AMC Period Startdate`, `AMC Period Enddate`, `Date of Last Maintenance`, `Inspection Frequency`, `Permanent`, `Workshop ID`) values ";
        for (var i = 1; i < quantity; i++) {
          tcodes = tcode + "/" + i;
          query += "('" + tcodes + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + iif + "', '" + amc + "', '" + amcpro + "', '" + amccon + "', '" + amcpersd + "', '" + amcpered + "', '" + dolm + "', '" + inf + "', '" + permanent + "'" + "," + "'" + workshop_id + "'" + "),";
        }
        tcodes = tcode + "/" + quantity;
        console.log(tcodes);
        query += "('" + tcodes + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + iif + "', '" + amc + "', '" + amcpro + "', '" + amccon + "', '" + amcpersd + "', '" + amcpered + ", '" + dolm + "', '" + inf + "', '" + permanent + "'" + "," + "'" + workshop_id + "'" + ");";
        var rows = await this.executeQuery(query);
        return 1;
      }
    }
    catch (error) {
      console.log(error);
      console.log("Error in addToolm");
      return 0;
    }
  }

  //workshop compliant
  // Adds tool which are not maintained but are kits
  async addToolWithChildren(childrenlist, tcode, tname, brand, value, location, description, dop, warranty_ed, quantity, maintained, permanent, workshop_id) {
    var query = "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Part Of Kit`, `Permanent`, `Workshop ID`) values";
    var ccode = "";
    var tcodes = "";
    if(value == '')
      value = 0;
    if(dop == "")
      dop = "1970-01-01";
    if(warranty_ed == "")
      warranty_ed = "1970-01-01";

    try {
      if (quantity > 1) {

        for (var i = 1; i <= quantity; i++) {
          tcodes = tcode + "/" + i;

          for (var j = 1; j <= childrenlist.length; j++) {
            ccode = tcodes + "/" + j;
            if ((j != childrenlist.length) || (i != quantity))
              query = query + "(" + "'" + ccode + "'" + "," + "'" + childrenlist[j - 1].name + "'" + "," + "'" + tcodes + "'" + "," + "'" + permanent + "'" + "," + "'" + workshop_id + "'" + "),";
            else {
              query = query + "(" + "'" + ccode + "'" + "," + "'" + childrenlist[j - 1].name + "'" + "," + "'" + tcodes + "'" + "," + "'" + permanent + "'" + "," + "'" + workshop_id + "'" + ");";
            }

          }
        }

        for (var i = 1; i <= quantity; i++) {
          tcodes = tcode + "/" + i;
          query = query + "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Brand`, `Value`, `Location`, `Description`, `Date of Purchase`, `Warranty Enddate`, `Maintenance`, `Permanent`, `Workshop ID`) values ('" + tcodes + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + permanent + "," + "'" + workshop_id + "'" + "'); ";
        }
        console.log(query);
        var rows = await this.executeQuery(query);
        return 1;
      }
      else {
        for (var i = 1; i <= childrenlist.length; i++) {
          ccode = tcode + "/" + i;
          if (i != childrenlist.length)
            query = query + "(" + "'" + ccode + "'" + "," + "'" + childrenlist[i - 1].name + "'" + "," + "'" + tcode + "'" + "," + "'" + permanent + "'" + "," + "'" + workshop_id + "'" + "),";
          else {
            query = query + "(" + "'" + ccode + "'" + "," + "'" + childrenlist[i - 1].name + "'" + "," + "'" + tcode + "'" + "," + "'" + permanent + "'" + "," + "'" + workshop_id + "'" + ");";
          }
        }
        query = query + "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Brand`, `Value`, `Location`, `Description`, `Date of Purchase`, `Warranty Enddate`, `Maintenance`, `Permanent`, `Workshop ID`) values ('" + tcode + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + permanent + "'" + "," + "'" + workshop_id + "'" + ") ";
        console.log(query);
        var rows = await this.executeQuery(query);
        return 1;
      }
    }
    catch (error) {
      console.log(error);
      console.log("Error in addTools");
      return 0;
    }

  }
  //workshop compliant
  // Adds tool which are maintained and are kits
  async addMaintainedToolWithChildren(childrenlist, tcode, tname, brand, value, location, description, dop, warranty_ed, quantity, maintained, amc, amcpro, amccon, amcpersd, amcpered, dolm, inf, permanent, workshop_id) {
    console.log("addToolsm");
    if(value == '')
      value = 0;
    if(dop == "")
      dop = "1970-01-01";
    if(warranty_ed == "")
      warranty_ed = "1970-01-01";
    if(amcpered == "")
      amcpered = "1970-01-01";
    if(amcpersd == "")
      amcpersd = "1970-01-01";
    if(dolm == "")
      dolm = "1970-01-01";
    var query = "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Part Of Kit`, `Permanent`, `Workshop ID`) values";
    for (var i = 0; i < childrenlist.length; i++) {
      if (i != childrenlist.length - 1)
        query = query + "(" + "'" + childrenlist[i].code + "'" + "," + "'" + childrenlist[i].name + "'" + "," + "'" + tcode + "'" + "," + "'" + permanent + "'" + "," + "'" + workshop_id + "'" + "),";
      else {
        query = query + "(" + "'" + childrenlist[i].code + "'" + "," + "'" + childrenlist[i].name + "'" + "," + "'" + tcode + "'" + "," + "'" + permanent + "'" + "," + "'" + workshop_id + "'" + ");";
      }
    }

    query += "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Brand`, `Value`, `Location`, `Description`, `Date of Purchase`, `Warranty Enddate`, `Maintenance`, `AMC`, `AMC Provider`, `AMC Contact`, `AMC Period Startdate`, `AMC Period Enddate`, `Date of Last Maintenance`, `Inspection Frequency`, `Permanent`, `Workshop ID`) values ('" + tcode + "', '" + tname + "', '" + brand + "', '" + value + "', '" + location + "', '" + description + "', '" + dop + "', '" + warranty_ed + "', '" + maintained + "', '" + amc + "', '" + amcpro + "', '" + amccon + "', '" + amcpersd + "', '" + amcpered + "', '" + dolm + "', '" + inf + "', '" + permanent + "," + "'" + workshop_id + "') ";

    try {
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch {
      console.log("Error in addToolsm");
      return 0;
    }

  }

  //workshop compliant
  async modifyTool(tcode, tname, brand, value, location, description, dop, warranty_ed, maintained, modifyToolcode, workshop_id) {
    if(value == '')
      value = 0;
    if(dop == "")
      dop = "1970-01-01";
    if(warranty_ed == "")
      warranty_ed = "1970-01-01";
    try {
      var query = "UPDATE `Tools` SET `Tool Code`='" + tcode + "', `Tool Name`='" + tname + "', `Brand`='" + brand + "', `Value`='" + value + "', `Location`='" + location + "', `Description`='" + description + "', `Warranty Enddate`='" + warranty_ed + "', `Date of Purchase`='" + dop + "', `Maintenance`='" + maintained + "' where `Tool Code` = '" + modifyToolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      query += "Update `Repair History` SET `Tool Name` = '" + tname + "' where `Tool Code`='" + tcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      query += "Update `Issue History` SET `Tool Name` = '" + tname + "' where `Tool Code`='" + tcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      query += "Update `Requests` SET `Tool Name` = '" + tname + "' where `Tool Code`='" + tcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      console.log(query);
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch {
      console.log("Error in modifyTool");
      return 0;
    }
  }

  //workshop compliant
  async modifyToolm(tcode, tname, brand, value, location, description, dop, warranty_ed, maintained, iif, amc, amcpro, amccon, amcpersd, amcpered, dolm, inf, modifyToolcode, workshop_id) {
    if(value == '')
      value = 0;
    if(dop == "")
      dop = "1970-01-01";
    if(warranty_ed == "")
      warranty_ed = "1970-01-01";
    if(amcpered == "")
      amcpered = "1970-01-01";
    if(amcpersd == "")
      amcpersd = "1970-01-01";
    if(dolm == "")
      dolm = "1970-01-01";
    try {
      var query = "UPDATE `Tools` SET `Tool Code`='" + tcode + "', `Tool Name`='" + tname + "', `Brand`='" + brand + "', `Value`='" + value + "', `Location`='" + location + "', `Description`='" + description + "', `Warranty Enddate`='" + warranty_ed + "', `Date of Purchase`='" + dop + "', `Maintenance`='" + maintained + "', `Internal Inspection Frequency`='" + iif + "', `AMC`='" + amc + "', `AMC Provider`='" + amcpro + "', `AMC Contact`='" + amccon + "', `AMC Period Startdate`='" + amcpersd + "', `AMC Period Enddate`='" + amcpered + "', `Date of Last Maintenance`='" + dolm + "', `Inspection Frequency`='" + inf + "' where `Tool Code` = '" + modifyToolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      query += "Update `Repair History` SET `Tool Name` = '" + tname + "' where `Tool Code`='" + tcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      query += "Update `Issue History` SET `Tool Name` = '" + tname + "' where `Tool Code`='" + tcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      query += "Update `Requests` SET `Tool Name` = '" + tname + "' where `Tool Code`='" + tcode + "' AND `Workshop ID` = '" + workshop_id + "';";
      console.log(query);
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch {
      console.log("Error in modifyToolm");
      return 0;
    }
  }

  //workshop compliant
  async modifyTools(childrenlist, tcode, tname, brand, value, location, description, dop, warranty_ed, maintained, modifyToolcode, kitlength, permanent, workshop_id) {
    var query = "";
    var ccode = "";
    if(value == '')
      value = 0;
    if(dop == "")
      dop = "1970-01-01";
    if(warranty_ed == "")
      warranty_ed = "1970-01-01";
    // query = query + "UPDATE `Tools` SET `Tool Code`='" + tcode + "', `Tool Name`='" + tname + "', `Brand`='" + brand + "', `Value`='" + value + "', `Location`='" + location + "', `Description`='" + description + "', `Date of Purchase`='" + dop + "', `Maintenance`='" + maintained + "' where `Tool Code` = '" + modifyToolcode + "'; ";
    var rows1 = await this.executeQuery("SELECT * from `Tools` where `Tool Code` = 'q/1'; ");
    console.log(rows1);
    for (var i = 1; i <= kitlength; i++) {
      ccode = tcode + "/" + i;
      query += "UPDATE `Tools` SET `Tool Code`='" + ccode + "',`Tool Name`='" + childrenlist[i - 1].name + "', `Part Of Kit`='" + tcode + "' where `Tool Code`='" + childrenlist[i - 1].code + "' AND `Workshop ID` = '" + workshop_id + "';";
    }
    for (var i = kitlength; i < childrenlist.length; i++) {
      ccode = tcode + "/" + (i + 1);
      query += "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Part Of Kit`, `Permanent`, `Workshop ID`) values ('" + ccode + "', '" + childrenlist[i].name + "', '" + tcode + "', '" + permanent + "', '" + workshop_id + "');";
    }

    query = query + "UPDATE `Tools` SET `Tool Code`='" + tcode + "', `Tool Name`='" + tname + "', `Brand`='" + brand + "', `Value`='" + value + "', `Location`='" + location + "', `Description`='" + description + "', `Date of Purchase`='" + dop + "', `Warranty Enddate`='" + warranty_ed + "', `Maintenance`='" + maintained + "' where `Tool Code` = '" + modifyToolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
    console.log(query);
    try {
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch {
      console.log("Error in modifyTools");
      return 0;
    }
  }
  //workshop compliant
  async modifyToolsm(childrenlist, tcode, tname, brand, value, location, description, dop, warranty_ed, maintained, amc, amcpro, amccon, amcpersd, amcpered, dolm, inf, modifyToolcode, kitlength, permanent, workshop_id) {

    var query = "";
    if(value == '')
      value = 0;
    if(dop == "")
      dop = "1970-01-01";
    if(warranty_ed == "")
      warranty_ed = "1970-01-01";
    if(amcpered == "")
      amcpered = "1970-01-01";
    if(amcpersd == "")
      amcpersd = "1970-01-01";
    if(dolm == "")
      dolm = "1970-01-01";
    for (var i = 0; i < kitlength; i++) {
      query += "UPDATE `Tools` SET `Tool Name`='" + childrenlist[i].name + "', `Part Of Kit`='" + tcode + "' where `Tool Code`='" + childrenlist[i].code + "' AND `Workshop ID` = '" + workshop_id + "';";
    }
    for (var i = kitlength; i < childrenlist.length; i++) {
      query += "INSERT INTO `Tools` (`Tool Code`, `Tool Name`, `Part Of Kit`, `Permanent`, `Workshop ID`) values ('" + childrenlist[i].code + "', '" + childrenlist[i].name + "', '" + tcode + "', '" + permanent + "', '" + workshop_id + "');";
    }
    query = query + "UPDATE `Tools` SET `Tool Code`='" + tcode + "', `Tool Name`='" + tname + "', `Brand`='" + brand + "', `Value`='" + value + "', `Location`='" + location + "', `Description`='" + description + "', `Date of Purchase`='" + dop + "', `Warranty Enddate`='" + warranty_ed + "', `Maintenance`='" + maintained + "', `AMC`='" + amc + "', `AMC Provider`='" + amcpro + "', `AMC Contact`='" + amccon + "', `AMC Period Startdate`='" + amcpersd + "', `AMC Period Enddate`='" + amcpered + "', `Date of Last Maintenance`='" + dolm + "', `Inspection Frequency`='" + inf + "' where `Tool Code` = '" + modifyToolcode + "' AND `Workshop ID` = '" + workshop_id + "';";
    console.log(query);
    try {
      var rows = await this.executeQuery(query);
      return 1;
    }
    catch {
      console.log("Error in modifyToolsm");
      return 0;
    }

  }

}

module.exports = connectorClass;