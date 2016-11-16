define(function (require) {
    var $ = require('zepto');
    var customElem = require('customElement').create();
    customElem.prototype.build = function () {
        var element = this.element,
            _id = element.getAttribute("asid");
        $(element).html(ttHtml);
        param.data.FCODE = funCaller.getQueryString('fundcode')||_id;
        param.dataPage.FCODE = funCaller.getQueryString('fundcode')||_id;
        funCaller.init(element);
    };
    var ttHtml=require('./dom');
    //var ttHtml=require('text!./dom.html');
        var param = {
            data: {
                FCODE: '',
                deviceid: "Wap",
                version: "4.3.0",
                product: "EFund",
                plat: "Wap",
            },
            dataPage: {
                FCODE: '',
                deviceid: "Wap",
                version: "4.3.0",
                product: "EFund",
                plat: "Wap",
                pageIndex: 1,
                pageSize: 3,
            },
            apiurl: "http://fundmobapitest.eastmoney.com/FundMApi/",
            funurl: "http://m.1234567.com.cn/m/fund/funddetail/",
            funBuyUrl: "https://tradewap.1234567.com.cn/buyfund.html",
            sameCompany: "http://m.1234567.com.cn/m/fund/jjjz.shtml",
            sameType: "http://m.1234567.com.cn/m/fund/jjph.shtml",
            fundtype: "",
            fundGetType: 1,
            isclick: {
                gotoJBCC: true,
                gotoFHPS: true,
                gotoJJJL: true,
                gotoJJGG: true,
            },
            page: {
                gotoJJGG: 1,
                gotoFHPS: 1,
            },
        },
        option_jjba = {
            'deviceid': 'Wap',
            'ps': 20,
            'plat': 'Wap',
            'product': 'Fund',
            'version': '201',
            'code': "of" + param.data.FCODE,
            'p': '',
            'type': '',
            'postid': 10,
            'sorttype': 0,
        }, timeoutFun = function () {
        };

    var funCaller = {
        init: function (el) {
            var _this = this;
            _this.Ajax('FundBase.ashx', param.data, _this.FundBaseloadView,el);
            _this.Ajax('FundNetDiagram.ashx', param.data, _this.FundNetDiagramloadView,el);

            _this.Ajax('FundSameCompanyList.ashx', param.data, _this.FundSameCompanyListloadView,el);
            _this.Ajax('FundSameTypeList.ashx', param.dataPage, _this.FundSameTypeListloadView,el);

            _this.discussLink(el);

        },
        FundBaseloadView: function (data,el) {
            var data = data.Datas;
            switch (data.FUNDTYPE) {
                case '003':
                    param.fundtype = 5;
                    param.fundGetType = 1;
                    break;
                case '004':
                case '005':
                    param.fundtype = 10;
                    param.fundGetType = 2;
                    break;
                case '006':
                    param.fundtype = 7;
                    param.fundGetType = 1;
                    break;
                case '007':
                    param.fundtype = 8;
                    param.fundGetType = 1;
                    break;
                case '201':
                    param.fundtype = 12;
                    param.fundGetType = 1;
                    break;
                default:
                    param.fundtype = 3;
                    param.fundGetType = 1;
                    break;

            }
            var RISKLEVEL = ['--', '低风险', '中低风险', '中风险', '中高风险', '高风险'], RISKLEVELname, RISKLEVELt;
            RISKLEVELt = Number(data.RISKLEVEL);
            switch (RISKLEVELt) {
                case 0:
                    RISKLEVELname = RISKLEVEL[0]
                    break;
                case 1:
                    RISKLEVELname = RISKLEVEL[1]
                    break;
                case 2:
                    RISKLEVELname = RISKLEVEL[2]
                    break;
                case 3:
                    RISKLEVELname = RISKLEVEL[3]
                    break;
                case 4:
                    RISKLEVELname = RISKLEVEL[4]
                    break;
                case 5:
                    RISKLEVELname = RISKLEVEL[5]
                    break;
            }
            var _this = this,
                tips1 = '', tips2 = '', date2, dellineData;
            data.DWJZ = funCaller.initNumber2(data.DWJZ, 4, true);

            funCaller.bindData(data.SHORTNAME, '#Fname');
            funCaller.bindData('(' + data.FCODE + ')', '.coder', '.header1');
            funCaller.bindData(data.FTYPE, '.header2', '.ui_outer');
            $(el).find('#baseInfo_url').find('.jjxx-h').append('<span class="ui_gray">' + data.FTYPE + '</span>');
            if (RISKLEVELname !== '--') {
                $('.ui_outer').find('.header2').append('<span class="split">|</span>' + RISKLEVELname);
                $(el).find('#baseInfo_url').find('.jjxx-h').append('<span class="split">|</span>' + RISKLEVELname);
            }
            if (data.RLEVEL_SZ !== null && data.RLEVEL_SZ !== '--' && data.RLEVEL_SZ !== '') {
                $('.ui_outer').find('.header2').append('<span class="split">|</span>' + data.RLEVEL_SZ + '星评级');
                $(el).find('#baseInfo_url').find('.jjxx-h').append('<span class="split">|</span>' + data.RLEVEL_SZ + '星评级');
            }

            if (param.fundGetType == 1) {
                $(el).find('#Fearnings').html('最新净值（<span class="numberFont">' + data.FSRQ.slice(5, 10) + '</span>）');
                $(el).find('#FearningsDay').html('日涨幅');
                funCaller.bindData(funCaller.initNumber2(data.DWJZ, 4, true), '#FearningsN1', 0, funCaller.isRed(data.RZDF));
                funCaller.bindData(funCaller.initNumber2(data.RZDF, 2), '#FearningsN2', 0, funCaller.isRed(data.RZDF));
                funCaller.bindData(data.Valuation ? (JSON.parse(data.Valuation).gsz) : "--", 'span:nth-child(2)', '#Fevaluation', data.Valuation ? funCaller.isRed(JSON.parse(data.Valuation).gszzl) : "");
                funCaller.bindData(data.Valuation ? (funCaller.initNumber2(JSON.parse(data.Valuation).gszzl, 2) ) : "--", 'span:nth-child(3)', '#Fevaluation', data.Valuation ? funCaller.isRed(JSON.parse(data.Valuation).gszzl) : "");
                date2 = data.Valuation ? JSON.parse(data.Valuation).gztime.substring(5, 16) : "";
                funCaller.bindData('(' + date2 + ')', 'span:nth-child(4)', '#Fevaluation');
            }
            else {
                $(el).find('#Fearnings').html('万份收益（<span class="numberFont">' + data.FSRQ.slice(5, 10) + '</span>）');
                $(el).find('#FearningsDay').html('7日年化');
               $(el).find('#Fevaluation').hide();
            }
            funCaller.bindData(funCaller.initNumber2(data.SYL_JN, 2), 'span', '#Info_url div:nth-child(1) ', funCaller.isRed(data.SYL_JN));
            funCaller.bindData(funCaller.initNumber2(data.SYL_Y, 2), 'span', '#Info_url div:nth-child(2)', funCaller.isRed(data.SYL_Y));
            funCaller.bindData(funCaller.initNumber2(data.SYL_6Y, 2), 'span', '#Info_url div:nth-child(3) ', funCaller.isRed(data.SYL_6Y));
            funCaller.bindData(funCaller.initNumber2(data.SYL_1N, 2), 'span', '#Info_url div:nth-child(4) ', funCaller.isRed(data.SYL_1N));
            if (data.SOURCERATE !== '' && data.SOURCERATE !== null)
                dellineData = '<span class="ui_delLine">' + data.SOURCERATE + ' </span> ' + data.RATE;
            else
                dellineData = data.RATE;
            funCaller.bindData(dellineData, '.ui_black.numberFont', '#buyInfo_url');

            $(el).find('#tab .tabContent').find('.img').attr('src', 'http://j4.dfcfw.com/charts/pic1/' + param.data.FCODE + '.png');
            $(el).find('#tab .tabContent').find('img').attr('src', 'http://j4.dfcfw.com/charts/pic1/' + param.data.FCODE + '.png');
            $(el).find('#Info_url').on('click', function () {
                window.location.href = 'http://m.1234567.com.cn/m/fund/fundjdsy/' + param.data.FCODE;
            })
            if (data.BUY)
                $(el).find('#buyJJ').on('click', function () {
                    window.location.href = 'https://tradewap.1234567.com.cn/buyfund.html#code=' + param.data.FCODE;
                });
            else
                $(el).find('#buyJJ').removeClass('ui-btn-orange').addClass('ui-btn-gray');
            funCaller.domclick(el);
        },


        FundNetDiagramloadView: function (data,el) {
            var _this = this,
                gotoLSSYL = $(el).find('#gotoLSSYL'),
                gotoLSSYLdiv = "",
                datas = data.Datas;
            gotoLSSYL.find('.ui-grid-8 p').html(param.fundGetType == 1 ? '历史净值' : '历史收益率');
            gotoLSSYLdiv += '<div class="fold_content"><div id="LSSYL_scroll"><table class="ui-table"><thead>';
            param.fundGetType == 1 ? gotoLSSYLdiv += '<tr><th>日期</th> <th>单位净值</th><th>累计净值</th><th>日增长率</th></tr></thead><tbody>' : gotoLSSYLdiv += '<tr><th>日期</th> <th>万份收益</th><th>7日年化</th></tr></thead><tbody>';
            for (i = 0; i < datas.length && i < 5; i++) {

                gotoLSSYLdiv += '<tr><td class="numberFont">' + datas[i].FSRQ + '</td>';
                gotoLSSYLdiv += '<td class="numberFont">' + funCaller.initNumber2(datas[i].DWJZ, 4, true) + '</td>';
                gotoLSSYLdiv += '<td class="numberFont">' + funCaller.initNumber2(datas[i].LJJZ, 4, true) + '</td>';
                param.fundGetType == 1 ? gotoLSSYLdiv += '<td class="' + funCaller.isRed(datas[i].JZZZL) + ' numberFont">' + funCaller.initNumber2(datas[i].JZZZL, 2) + '</td>' : '';
                gotoLSSYLdiv += '</tr>';
            }

            gotoLSSYLdiv += '</tbody></table></div>';
            if (data.TotalCount > 5)
                gotoLSSYLdiv += '<p class="ui_alignCenter tip lssylMore"><a href="http://js1.eastmoney.com/tg.aspx?ID=4205" target="_blank">下载天天基金网APP，查看更多&gt;</a></p>';

            gotoLSSYLdiv += '</div>';

            gotoLSSYL.after(gotoLSSYLdiv);
        },
        gotoJBCCloadView: function (data,el) {
            if(data.Datas.length==0) {
             $(el).find('#gotoJBCC').next('.fold_content').html('<span class="notips">暂无数据</span>');
             return;
            }
            var _this = this;
            param.isclick.gotoJBCC = false;
            var gotoJBCC = $(el).find('#gotoJBCC'), gotoJBCCcontent = $(el).find('#jbcc_scroll').find('tbody'), tbody = "", datas = data.Datas;
            $(el).find('#cjjzri').html('截止日期：<span class="numberFont">' + datas[0].ShareDate + '</span>').show();
            for (i = 0; i < datas.length; i++) {
                tbody += '<tr><td> <a href="http://m.quote.eastmoney.com/stock,' + datas[i].ShareCode + '.shtml">' + datas[i].ShareName + '</a></td>';
                tbody += '<td class="numberFont">' + datas[i].ShareProportion + '</td>';
                tbody += '<td class="' + funCaller.isRed(datas[i].ShareGain) + ' numberFont">' + funCaller.initNumber2(datas[i].ShareGain * 100, 2) + '</td></tr>';
            }
            gotoJBCCcontent.html(tbody);
        },
        FundSameCompanyListloadView: function (data,el) {
            var tgsqxjj_url = $(el).find('#tgsqxjj_url'), pageContentTgsqxjj = $(el).find('.pageContentTgsqxjj'), thisul = pageContentTgsqxjj.find('.fund-list');
            tgsqxjj_url.attr('data-href', param.sameCompany + '?companyid=' + data.Expansion + '#1');
            funCaller.bindData(data.TotalCount, '.numberFont', '#tgsqxjj_url');
            var datas = data.Datas;
            var thishtml = thisul.html();
            thisul.html('');
            for (i = 0; i < datas.length; i++) {
                thisul.append(thishtml);
                var _thisli = thisul.find('li').eq(i);
                _thisli.children('a').attr('href', param.funurl + '?fundcode=' + datas[i].FCODE);
                var _thistbl = _thisli.find('.fund-tbl');
                _thistbl.find('.fund-title a').attr('href', param.funurl + '?fundcode=' + datas[i].FCODE).html(datas[i].SHORTNAME);
                _thistbl.find('.fund_minsg span').html(datas[i].MINSG);
                _thistbl.find('.profit').html(funCaller.initNumber2(datas[i].SYL, 2));
                _thistbl.find('.profit').next('.profit-title').html(datas[i].SYLMARK);
                _thistbl.find('.fund-fl.font15').html(datas[i].SOURCERATE);
                _thistbl.find('.fund-fl.font15W').html(datas[i].RATE);
                _thistbl.find('.fund-buy').attr('href', param.funBuyUrl + '#code=' + datas[i].FCODE);
            }
            var _turl = param.sameCompany + '?companyid=' + data.Expansion + '#1';
            thisul.append('<li class="fund-item-last1"><a class="more" href=' + _turl + '>查看同公司旗下基金&gt;</a><a></a></li>');
            tgsqxjj_url.on('click', function () {
                window.location.href = $(this).attr('data-href');
            });
        },
        FundSameTypeListloadView: function (data,el) {
            var tljjzf_url = $(el).find('#tljjzf_url'), pageContentTljjzf = $(el).find('.pageContentTljjzf'), thisul = pageContentTljjzf.find('.fund-list');
            tljjzf_url.attr('data-href', param.sameType + '#' + param.fundtype);
            funCaller.bindData(data.TotalCount, '.numberFont', '#tljjzf_url');
            var datas = data.Datas;
            var thishtml = thisul.html();
            thisul.html('');
            for (i = 0; i < datas.length; i++) {
                thisul.append(thishtml);
                var _thisli = thisul.find('li').eq(i);
                _thisli.children('a').attr('href', param.funurl + '?fundcode=' + datas[i].FCODE);
                var _thistbl = _thisli.find('.fund-tbl');
                _thistbl.find('.fund-title a').attr('href', param.funurl + '?fundcode=' + datas[i].FCODE).html(datas[i].SHORTNAME);
                _thistbl.find('.fund_minsg span').html(datas[i].MINSG);
                _thistbl.find('.profit').html(funCaller.initNumber2(datas[i].SYL, 2));
                _thistbl.find('.profit').next('.profit-title').html(datas[i].SYLMARK);
                _thistbl.find('.fund-fl.font15').html(datas[i].SOURCERATE);
                _thistbl.find('.fund-fl.font15W').html(datas[i].RATE);
                _thistbl.find('.fund-buy').attr('href', param.funBuyUrl + '#code=' + datas[i].FCODE);
            }
            var _turl = param.sameType + '#' + param.fundtype;
            thisul.append('<li class="fund-item-last1"><a class="more" href=' + _turl + '>查看全部同类基金>&gt;</a><a></a></li>');
            tljjzf_url.on('click', function () {
                window.location.href = $(this).attr('data-href');
            });
        },
        gotoJJJLloadView: function (data,el) {
            var _this = this, gotoJJJL_scroll = $(el).find('#gotoJJJL_scroll'), scrolltable = "", datas = data.Datas;
            for (i = 0; i < datas.length; i++) {
                var t = datas[i].LEMPDATE == "" ? '至今' : datas[i].LEMPDATE;
                scrolltable += '<tr><td>' + datas[i].FEMPDATE + '</td>';
                scrolltable += '<td>' + t + '</td>';
                scrolltable += '<td>' + datas[i].MGRNAME + '</td>';
                scrolltable += '<td>' + datas[i].DAYS + '天</td>';
                scrolltable += '<td class="' + funCaller.isRed(datas[i].PENAVGROWTH.toString()) + '">' + funCaller.initNumber2(datas[i].PENAVGROWTH, 2) + '</td></tr>';
            }
            gotoJJJL_scroll.find('tbody').html(scrolltable);
            param.isclick.gotoJJJL = false;
        },
        gotoJJJLdetailloadView: function (data,el) {
            var _this = this, gotoJJJL_detail = $(el).find('#gotoJJJL_detail'), detail = "", datas = data.Datas;
            for (i = 0; i < datas.length; i++) {
                var imgurl = datas[i].PHOTOURL == null ? 'http://j5.dfcfw.com/avatar/nopic.gif' : datas[i].PHOTOURL;
                detail += '<div class="ui-grid-row"><div class="ui-grid-4">';
                detail += '<img width="80" src="' + imgurl + '">';
                detail += '</div><div class="ui-grid-6 jjjlInfo">';
                detail += '<p>姓名：<span>' + datas[i].MGRNAME + '</span></p>';
                detail += '<p>上任日期：<span>' + datas[i].FEMPDATE + '</span></p>';
                detail += '<p>管理年限<span>' + funCaller.fomateDate(datas[i].DAYS) + '</span></p>';
                detail += '</div><div class="ui-grid-10 jjjltxt">';
                detail += '<p class="on">' + datas[i].RESUME + '</p>';
                detail += '<a class="togglebtn down">全部简介</a> </div></div>';

            }
            gotoJJJL_detail.html(detail);
            $('.togglebtn').on('click', function () {
                $(this).hasClass('down') ? $(this).removeClass('down').addClass('up').prev('p').removeClass('on') : $(this).removeClass('up').addClass('down').prev('p').addClass('on');
            });
        },
        gotoJJGGLoadView: function (data,el) {
            var _this = this, gotoJJGG = $(el).find('#gotoJJGG').next('.fold_content'), div = "", datas = data.Datas;
            div += '<div class="jjggContent">';
            for (i = 0; i < datas.length; i++) {
                div += '<div class="ui-grid-row" data-id=' + datas[i].ID + '><p class="ui-grid-2">' + datas[i].PUBLISHDATE.slice(5, 10) + '</p>';
                div += '<p class="ui-grid-8">' + datas[i].TITLE + '</p></div>';
            }
            div += '</div>';
            data.TotalCount > 5 ? div += '<p class="ui_alignCenter tip" id="jjggMore">查看更多</p>' : '';
            gotoJJGG.html(div).show();

            param.isclick.gotoJJGG = false;
            $(el).find('#jjggMore').on('click', funCaller.gotoJJGGmore);
            $(el).find('.jjggContent').find('.ui-grid-row').on('click', function () {
                window.location.href = "http://m.1234567.com.cn/m/fund/FundJJGSGG/" + param.data.FCODE + "_" + $(this).attr('data-id');
            })
        },
        gotoJJGGmore: function (el) {
            var _this = this;
            param.page.gotoJJGG++;
            param.dataPage.pageIndex = 1;
            param.dataPage.pageSize = 5 * param.page.gotoJJGG;
            funCaller.Ajax('FundNoticeList.ashx', param.dataPage, funCaller.gotoJJGGLoadView,el);
        },
        gotoFHPSloadView: function (data,el) {
            var gotoFHPS = $(el).find('#gotoFHPS').next('.fold_content'), div = "", datas = data.Datas, CFnumber = 0;
            div += '<div class="fhpsContent">';
            div += '<p class="ui_remark">成立以来，总计分红' + data.TotalCount + '次，拆分0次</p>';
            for (i = 0; i < datas.length; i++) {
                div += '<div class="ui-grid-row">';
                div += '<p class="ui-grid-3">' + datas[i].FSRQ + '</p>';
                div += '<p class="ui-grid-7">每份派现金<b>' + datas[i].FHFCZ + '</b>元</p>';
                div += '</div>';
                if (Number(datas[i].FHFCBZ) !== 0)
                    CFnumber++;
            }
            div += '</div>';
            data.TotalCount > 5 ? div += '<p class="ui_alignCenter tip"  id="fhpsMore">查看更多</p>' : '';
            gotoFHPS.html(div).show();
            if (CFnumber !== 0) $('p.ui_remark').html('成立以来，总计分红' + data.TotalCount + '次，拆分' + CFnumber + '次');
            for (j = 5; j < datas.length; j++) {
                gotoFHPS.find('.ui-grid-row').eq(j).hide();
            }

            param.isclick.gotoFHPS = false;
            $(el).find('#fhpsMore').on('click', function () {
                for (q = 5 * param.page.gotoFHPS; q < datas.length && q < 5 * param.page.gotoFHPS + 5; q++) {
                    gotoFHPS.find('.ui-grid-row').eq(q).show();
                }
                param.page.gotoFHPS++;
                param.page.gotoFHPS * 5 > datas.length ? $(el).find('#fhpsMore').hide() : '';
            });
        },
        gotoFHPSloadViewMore: function (data,el) {
            var div = '';
            for (i = 5; i < data.length; i++) {
                div += '<div class="ui-grid-row">';
                div += '<p class="ui-grid-3">' + data[i].FSRQ + '</p>';
                div += '<p class="ui-grid-7">每份派现金<b>' + data[i].FHFCZ + '</b>元</p>';
                div += '</div>';
            }
            $(el).find('#gotoFHPS').next('.fold_content').find('.fhpsContent:last-child').after(div);
        },
        discussLink: function (options) {
            $.ajax({
                type: "GET",
                dataType: 'json',
                url: 'https://fundmobapitest.eastmoney.com/gubaapi/v3/Read/Article/Post/Articlelist.ashx',
                data: option_jjba,
                success: function (resultData) {
                    $('.discussLink').attr('href', 'http://jjbmob.eastmoney.com/fundDynamicsForFundBar.html#postid=of' + param.data.FCODE);
                    $('.discussLink').find('span').html(resultData.count);

                },
                error: function (error) {
                    $.alertWindow("网络不给力，请稍后重试", callback);
                }
            });
        },

        Ajax: function (url, data, callback,el) {
            var _this = this;
            funCaller.hardLoad();
            $.ajax({
                type: "GET",
                dataType: 'jsonp',
                // type: "POST",
                url: param.apiurl + url,
                data: data,
                success: function (resultData) {
                    if (typeof resultData == 'string') resultData = JSON.parse(resultData);
                    if (resultData["ErrCode"] == 0) {
                        callback(resultData,el);
                    }
                    else {
                        if (isEmpty(resultData["ErrMsg"])) {
                            resultData["ErrMsg"] = "网络不给力，请稍后重试";
                        }
                        else if (resultData["ErrMsg"] == "服务异常" || resultData["ErrMsg"] == "系统繁忙!") {
                            resultData["ErrMsg"] = "网络不给力，请稍后重试";
                        }
                        funCaller.alertWindow(resultData["ErrMsg"], callback);
                    }
                    funCaller.hideMask();

                },
                error: function (error) {
                    funCaller.alertWindow("网络不给力，请稍后重试", callback);
                    funCaller.hideMask();
                }

            });
        },
        domclick: function (el) {
            $(el).find('#tab').find('.tab p').on('click', function () {
                $(this).addClass('active').siblings('p').removeClass('active');
                $(this).parents('.tab').next('.tabContent').find('.img').attr('src', $(this).attr('data-imgurl') + param.data.FCODE + '.png');
                $(this).parents('.tab').next('.tabContent').find('img').attr('src', $(this).attr('data-imgurl') + param.data.FCODE + '.png');
            });
            $(el).find('#gotoLSSYL').on('click', function () {
                var _this = this;
                funCaller.toggleShow(_this);
            });
            $(el).find('#buyInfo_url').on('click', function () {
                window.location.href = 'http://m.1234567.com.cn/m/fund/fundfl/' + param.data.FCODE;
            });
            $(el).find('#baseInfo_url').on('click', function () {
                window.location.href = "http://m.1234567.com.cn/m/fund/fundjbxx/" + param.data.FCODE;
            });
            $(el).find('#tljjzf_url').on('click', function () {
                window.location.href = $(this).attr('data-href');
            });
            $(el).find('#gotoJBCC').on('click', function () {
                var _this = this;
                funCaller.toggleShow(_this);
                if (param.isclick.gotoJBCC)
                    funCaller.Ajax('FundPositionList.ashx', param.data, funCaller.gotoJBCCloadView,el);
            });
            $(el).find('#gotoFHPS').on('click', function () {
                var _this = this;
                funCaller.toggleShow(_this);
                if (param.isclick.gotoFHPS) {
                    funCaller.Ajax('FundBonusList.ashx', param.data, funCaller.gotoFHPSloadView,el);
                }

            });
            $(el).find('#gotoJJJL').on('click', function () {
                var _this = this;
                funCaller.toggleShow(_this);
                if (param.isclick.gotoJJJL) {
                    funCaller.Ajax('FundManagerList.ashx', param.data, funCaller.gotoJJJLloadView,el);
                    funCaller.Ajax('FundMangerDetail.ashx', param.data, funCaller.gotoJJJLdetailloadView,el);
                }

            });
            $(el).find('#gotoJJGG').on('click', function () {
                var _this = this;
                funCaller.toggleShow(_this);
                if (param.isclick.gotoJJGG) {
                    param.dataPage.pageIndex = 1;
                    param.dataPage.pageSize = 5;
                    funCaller.Ajax('FundNoticeList.ashx', param.dataPage, funCaller.gotoJJGGLoadView,el);
                }
            });
            $(el).find('#gotopinglun').on('click', function () {
                window.location.href = 'http://jjbmob.eastmoney.com/fundDynamicsForFundBar.html#postid=of' + param.data.FCODE;
            });
            $(el).find('#shareInfo').on('click', function () {
                var _this = $(this),
                    $flexShare = _this.siblings("#flexShare");
                $flexShare.toggleClass("hide");
            });
            var user = null;
            $(el).find('#addFavor').on('click', function (e) {
                if (!user || !user.id) {
                    window.location.href = "http://m.passport.eastmoney.com/login.m?backurl=" + encodeURIComponent(encodeURIComponent(location.href));
                    return;
                }

                var favorHtml = $(e.currentTarget).html();
                var option = {
                    FundType: 85,
                    /*所有*/
                    Operation: "a",
                    Uid: user.id,
                    deviceid: "",
                    plat: "wap",
                    product: "EFund",
                    version: "",
                    Fcodes: param.data.FCODE
                }
                if (favorHtml == "加自选") {
                    option.Operation = "a";
                } else {
                    option.Operation = "d";
                }
                this.addFavor(option, function (data) {
                    if (data.ErrCode == 0) {

                        if (favorHtml == "加自选") {
                            $(e.currentTarget).html("删自选");

                            $.alertWindow('添加成功', function () {
                                location.href = href;
                            }, '关闭', function () {
                            })
                        }
                        else {
                            $(e.currentTarget).html("加自选");
                            $.alertWindow('<span>删除成功</span>', function () {
                                location.href = href;
                            })
                        }
                    } else {
                        $.alertWindow('添加失败，请稍后重试！', function () {
                            location.href = href;
                        })
                    }

                });
            });
        },
        toggleShow: function (options) {
            if ($(options).next('.fold_content').css('display') == 'block') {
                $(options).next('.fold_content').hide();
                $(options).find('.iconfont').removeClass('ui_fold').addClass('ui_unfold');
            } else {
                $(options).next('.fold_content').show();
                $(options).find('.iconfont').removeClass('ui_unfold').addClass('ui_fold');
            }

        },
        initNumber2: function (n, m, bol) {
            if (!n) {
                return '--'
            }
            var b = !bol ? '%' : ''
            n = parseFloat(n).toFixed(m) + b;

            return n;
        },
        fomateDate: function (d) {
            if (d < 365) return d + '天';
            else {
                var n = parseInt(d / 365);
                var a = parseInt(d % 365);

                return n + '年又' + a + '天'
            }
        },
        isRed: function (str) {
            if (!str || str == null || str == "null") return 'ui_black';

            var bol = str.indexOf('-');
            if (bol < 0) {
                if (parseFloat(str) == 0) {
                    return 'ui_black';
                }
                return 'ui_red';
            }
            else if (parseFloat(str) < 0) return 'ui_green';
            else return 'ui_black';
        },
        isEmpty: function (value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (this.isArray(value) && value.length === 0) || (value == "(null)");
        },
        initAlertMask: function () {

            var alertMaskerUI = $("#_alertMaskerUI_");
            if (alertMaskerUI != null) {
                alertMaskerUI.remove();
            }

            var alertMaskhtml =
                '<div class="alertMasker" id="_alertMaskerUI_">' +
                    '<div>' +
                    '<div class="alert">' +
                    '<div class="inner">' +
                    /*'<h2>温馨提示</h2>'+*/
                    '<p></p>' +
                    '<footer>' +
                    '<a href="javascript:void(null)" class="button" for="yes" >确定</a>' +
                    '</footer>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

            $("body").append(alertMaskhtml);

        },
        alertWindow: function (txt, callback, option) {
            var _this = this;
            var target = $("#_alertMaskerUI_");
            if (target.is(":visible")) {
                return false;
            }

            var tempTxt = txt ? txt : "";
            var tempCallback = callback ? callback : function () {
            };

            var btnTxt = option ? "确定" : option;
            target.find(".btn").html(btnTxt);

            target.show();
            target.find("p").html(tempTxt);
            target.find(".alert").addClass("show");

            var tempTapFun = function (e) {
                // e.stopPropagation();

                setTimeout(function () {
                    _this.closeAlertWindow();
                    tempCallback(false);
                }, 300)

            };

            var btn = target.find(".button[for=yes]");
            btn.off("tap").on("tap", tempTapFun);
        },
        closeAlertWindow: function () {
            var target = $("#_alertMaskerUI_");
            target.hide();
            target.find(".alert").removeClass("show");
        },
        addFavor: function (option, callback) {
            $.hardLoad();
            $.ajax({
                type: "GET",
                dataType: 'jsonp',
                url: "http://fundex2.eastmoney.com/FundMobileApi/FundFavor.ashx",
                data: option,
                success: function (resultData) {
                    if (typeof resultData == 'string') resultData = JSON.parse(resultData);

                    var result = resultData["Datas"];


                    if (resultData["ErrCode"] == 0) {
                        callback(resultData);
                    }
                    else {
                        if ($.isEmpty(resultData["ErrMsg"])) {
                            resultData["ErrMsg"] = "网络不给力，请稍后重试";
                        }
                        else if (resultData["ErrMsg"] == "服务异常" || resultData["ErrMsg"] == "系统繁忙!") {
                            resultData["ErrMsg"] = "网络不给力，请稍后重试";
                        }
                        funCaller.alertWindow(resultData["ErrMsg"], callback);
                    }
                    funCaller.hideMask();

                },
                error: function (error) {
                    funCaller.alertWindow("网络不给力，请稍后重试", callback);
                    funCaller.hideMask();
                }

            });
        },
        hardLoad: function (txt, callback) {
            var _this = this;
            funCaller.load(txt ? txt : "加载中");
            var loadingMaskUI = $("#_loadingMaskUI_");
            var c = loadingMaskUI.attr('c');

            if (!c) c = 0;
            loadingMaskUI.attr('c', ++c);

            if (loadingMaskUI.is(":visible")) {

                return false;
            }

            loadingMaskUI.css({"display": "table", "background": "rgba(0,0,0,0)"});

            var tempCustomFun = callback ? callback : function () {
                funCaller.alertWindow("网络不给力，请稍后重试");
            };

            var tempCallback = function () {
                funCaller.hideMaskForce();
                tempCustomFun();
            };

            clearTimeout(timeoutFun);
            timeoutFun = setTimeout(tempCallback, 30000);
        },
        load: function (txt) {
            $("#_loadingMaskUI_ div[ui]").hide();
            $("#_loadingMaskUI_ ._maskload_").show().find("span").html(txt);
        },
        hideMaskForce: function () {
            var loadingMaskUI = $("#_loadingMaskUI_");
            loadingMaskUI.css("display", "none");
            clearTimeout(timeoutFun);
        },
        hideMask: function () {

            var loadingMaskUI = $("#_loadingMaskUI_");
            var c = loadingMaskUI.attr('c');

            if (c <= 1) {
                loadingMaskUI.attr('c', 0)
                loadingMaskUI.css("display", "none");
            } else {
                loadingMaskUI.attr('c', --c)
            }
            clearTimeout(timeoutFun);

        },
        getQueryString: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return "";

        },
        bindData: function (data, Cid, Pid, color) {
            var dom;
            dom = Pid !== null && Pid !== undefined && Pid !== 0 ? $(Pid).find(Cid) : $(Cid);
            if (color !== undefined) dom.addClass(color);
            dom.html(data);
        },
    }

    return customElem;
});