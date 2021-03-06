        function operateTree($scope) {
            var fields = form.Fields;
            var controlID=$("#configure_data_tree").attr("controlID");
            var controlType=$("#configure_data_tree").attr("controlType");
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].Name == controlID) {
                    $("#controlId").val(fields[i].Name);
                    $("#data_custom_param").val(fields[i].Text);
                    $("#sql_data").val(fields[i].DataSource);
                    $("#data_url").val(fields[i].URL);
                    if (fields[i].Required) {
                        $("#checkboxTree").attr("checked", "checked");
                    } else {
                        $("#checkboxTree").removeAttr("checked");
                    }
                    if (fields[i].DataSource) {
                        $("#data_type").val("sql");
                        $("#customsql_data").show();
                        $("#custom_data").hide();
                        $("#rest_data").hide();
                    } else if (fields[i].Text) {
                        $("#data_type").val("custom");
                        $("#customsql_data").hide();
                        $("#custom_data").show();
                        $("#rest_data").hide();
                    } else if (fields[i].URL) {
                        $("#data_type").val("rest");
                        $("#customsql_data").hide();
                        $("#custom_data").hide();
                        $("#rest_data").show();
                    }
                    $("#data_img").val(fields[i].DefaultValue);
                    $("#controlWidth").val($("#"+controlID).width());
                    $("#controlHeight").val($("#"+controlID).height());
                    //for (var j = 0; j < fields[i].ListItems.length; j++) {
                    //    ListItems.push(fields[i].ListItems[j]);
                    //}
                    if (!fields[i].ListItems) {
                        fields[i].ListItems = new Array();
                    }
                    if (fields[i].ListItems.length > 0) {
                        $scope.contextmenu = true;
                    } else {
                        $scope.contextmenu = false;
                    }
                    $scope.Lists = fields[i].ListItems;
                    $scope.upOperate = function(list) {
                        var position = $scope.Lists.indexOf(list);
                        if (position > 0 && position < $scope.Lists.length) {
                            $scope.Lists.splice(position, 1);
                            $scope.Lists.splice(position - 1, 0, list);
                        }
                    };
                    $scope.downOperate = function(list) {
                        var position = $scope.Lists.indexOf(list);
                        if (position < $scope.Lists.length) {
                            $scope.Lists.splice(position, 1);
                            $scope.Lists.splice(position + 1, 0, list);
                        }
                    };
                    $scope.addParameter = function() {
                        if (!$scope.Lists) {
                            $scope.Lists = new Array();
                        }
                        $scope.Lists.push({
                            Value: "style",
                            Text: '{ \\"text\\":\\"显示名称\\", \\"callback\\": \\"function\\" }'
                        });
                        // $scope.Lists.push({ Value: "style", Text: '{ "text":"显示名称", "callback": "function" }' });
                    };
                    $scope.delParameter = function(List) {
                        var position = $scope.Lists.indexOf(List);
                        $scope.Lists.splice(position, 1);
                        if ($scope.Lists.length < 1) {
                            $scope.contextmenu = false;
                        }
                    };

                }
            }
        }
        formdesigner.dialogs.add('Tree', (function() {
            function initEvent(controlID, controlType) {
                $("#data_type").change(function() {
                    var value = $(this).val();
                    switch (value) {
                        case "sql":
                            $("#customsql_data").show();
                            $("#custom_data").hide();
                            $("#rest_data").hide();
                            break;
                        case "custom":
                            $("#customsql_data").hide();
                            $("#custom_data").show();
                            $("#rest_data").hide();
                            break;
                        case "rest":
                            $("#customsql_data").hide();
                            $("#custom_data").hide();
                            $("#rest_data").show();
                            break;
                    }
                });
                $("#configure_data_tree").attr("controlID", controlID);
                $("#configure_data_tree").attr("controlType", controlType);
                $("#configure_data_tree").attr("ng-controller", "operateTree");
                angular.bootstrap($("#configure_data_tree"));
                $("#save")
                    .button()
                    .click(function(event) {
                    event.preventDefault();
                    var required = true;
                    if ($("#checkboxTree").attr("checked") != "checked") {
                        required = false;
                    }
                    if (typeof(parent.setContorlValue) == "function") {
                        parent.setContorlValue({
                            Required: required,
                            URL: $("#data_url").val(),
                            DefaultValue: $("#data_img").val(),
                            ControlType: controlType,
                            OldID: controlID,
                            ID: $("#controlId").val(),
                            Name: $("#controlId").val(),
                            Text: $("#data_custom_param").val(),
                            DataSource: $("#sql_data").val(),
                            Width: $("#controlWidth").val(),
                            Height: $("#controlHeight").val()
                        }, 1);
                    }
                    window.parent.$("#actionDialog").dialog("close");

                });
                $("#cancel")
                    .button()
                    .click(function(event) {
                    event.preventDefault();
                    window.parent.$("#actionDialog").dialog("close");
                });
            };
            var htmlAttr = '<div id="configure_data_tree">' +
                '<div class="container">' +
                '<div class="data_left">控件ID</div>' +
                '<input type="text" class="data_right" id="controlId" />' +
                '</div>' +
                '<div class="container">' +
                '<div class="data_left">是否为选择树</div>' +
                '<input type="checkbox" style="margin-top: 13px;" id="checkboxTree" checked="checked" />' +
                '</div>' +
                '<div class="container">' +
                '<div class="data_left">数据源来源</div>' +
                '<select id="data_type" class="data_right">' +
                '<option value="sql">sql语句</option>' +
                '<option value="custom">自定义</option>' +
                '<option value="rest">rest方式</option>' +
                '</select>' +
                '</div>' +
                '<div id="customsql_data">' +
                '<div class="container">' +
                '<div class="data_left">自定义sql语句</div>' +
                '<textarea class="data_right" id="sql_data" style="height: 175px"></textarea>' +
                '</div>' +
                '<div class="container">' +
                '<div class="data_left">备注:</div>' +
                '<div>' +
                '<p class="data_right">' +
                '自定义可以是sql或存储过程，但返回的结果集中必须包含parentID,parentName,ID ,Name列,type列为可选列(如果定义右击菜单则为必须列,如无定义则整个树绑定同一个右击菜单，type为"root"）' +
                '<br>' +
                '如 select c1 as ID ,c2 as ParentName ,c3 as ParentID ,c4 as Name from' +
                'tablename' +
                '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="custom_data" style="display: none">' +
                '<div class="container">' +
                '<div class="data_left">自定义数据</div>' +
                '<textarea class="data_right" id="data_custom_param" style="height: 175px"></textarea>' +
                '</div>' +
                '<div class="container">' +
                '<div class="data_left">数据格式为：</div>' +
                '<div class="data_right">' +
                '<p>' +
                '<br>' +
                '{' +
                '"data" : "node_title",' +
                '<br>' +
            // omit `attr` if not needed; the `attr` object gets passed to the jQuery `attr`
            'function' +
                '<br>' +
                '"attr" : { "id" : "node_identificator", "some-other-attribute" : "attribute_value"' +
                '},' +
                '<br>' +
            // `state` and `children` are only used for NON-leaf nodes
            '<br>' +
                '"state" : "closed", // or "open", defaults to "closed"' +
                '<br>' +
                '"children" : [ /* an array of child nodes objects */ ]' +
                '}' +
                ' <br>' +
                '"data" : {' +
                '<br>' +
                '"title" : "The node title",' +
                '<br>' +
            // omit when not needed
            '<br>' +
                '"attr" : {},' +
                '<br>' +
            // if `icon` contains a slash / it is treated as a file, used for background
            '<br>' +
            // otherwise - it is added as a class to the ins node
            '<br>' +
                '"icon" : "folder"' +
                '<br>' +
                '}' +
                '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div id="rest_data" style="display: none">' +
                '<div class="container">' +
                '<div class="data_left">URL</div>' +
                '<input type="text" class="data_right" id="data_url" />' +
                '</div>' +
                '</div>' +
                '<div class="container">' +
                '<div class="data_left">添加右击菜单</div>' +
                '<input type="checkbox" style="margin-top: 13px;" id="contextmenu_tree" ng-model="contextmenu"' +
                '/>' +
                '</div>' +
                '<div style="padding-left: 100px; text-align: center" id="contextmenucontent_main"' +
                'class="container" ng-show="contextmenu">' +
                '<table>' +
                '<tr>' +
                '<td style="width: 165px">type类型</td>' +
                '<td style="width: 165px">绑定对象名</td>' +
                '<td><span ng-click="addParameter();" class=\'btn_add\' title=\'添加\'></span></td>' +
                '</tr>' +
                '<tr ng-repeat="List in Lists">' +
                '<td>' +
                '<input type="text" ng-model="List.Value" /></td>' +
                '<td>' +
                '<input type="text" ng-model="List.Text" /></td>' +
                '<td><span class="btn_up" title="上移" ng-click="upOperate(List)"></span>' +
                '<span style="float: left">｜</span><span class="btn_down" title=\'下移\' ng-click="downOperate(List)">' +
                '</span><span style="float: left">｜</span><span class=\'btn_delete\' ng-click="delParameter(List)"' +
                'title="删除"></span></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '<div class="container" style="display: none">' +
                '<div class="data_left">图片</div>' +
                '<input type="text" class="data_right" id="data_img" />' +
                '</div>' +

            '<div id="configure_data_width" class="container">' +
                '<div class="data_left_two">宽度</div>' +
                '<input id="controlWidth" type="text" class="data_right_two" />' +
                '</div>' +
                '<div id="configure_data_height">' +
                '<div class="data_left_two">高度</div>' +
                '<input id="controlHeight" type="text" class="data_right_two" />' +
                '</div>' +
                '<div id="btnchoose">' +
                '<input type="button" id="save" value="确定" />' +
                '<input type="button" id="cancel" value="取消" />' +
                '</div>' +
                '</div>'
            var dialog = {
                dialogContent: {
                    title: "配置窗口",
                    width: 702,
                    content: htmlAttr
                },
                dialogScript: initEvent
            };
            return dialog;
        })());