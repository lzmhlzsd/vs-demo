var DataBigScreen = function(options) {
        this.datetimeElement = options.datetimeElement;
        this.runSystemTime();
    }
//系统时间
DataBigScreen.prototype.runSystemTime = function() {
    var date, years, months, dates, hours, minutes, seconds, dateStr = '',
        timeStr = '';
    var self = this;

    function runTime() {
        date = new Date();
        years = date.getFullYear();
        months = date.getMonth() + 1;
        dates = date.getDate();
        hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

        dateStr = years + '年' + months + '月' + dates + '日';
        timeStr = hours + ':' + minutes + ':' + seconds;

        //dateElement.html(dateStr);
        self.datetimeElement.html(dateStr + ' ' + timeStr);
        setTimeout(runTime, 1000);
    }

    runTime();

}
