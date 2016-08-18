(function () {

    // 获取 wangEditor 构造函数和 jquery
    var E = window.wangEditor;
    var $ = window.jQuery;

    // 用 createMenu 方法创建菜单
    E.createMenu(function (check) {

        // 定义菜单id，不要和其他菜单id重复。编辑器自带的所有菜单id，可通过『参数配置-自定义菜单』一节查看
        var menuId = 'pindent';

        // check将检查菜单配置（『参数配置-自定义菜单』一节描述）中是否该菜单id，如果没有，则忽略下面的代码。
        if (!check(menuId)) {
            return;
        }

        // this 指向 editor 对象自身
        var editor = this;

        // 创建 menu 对象
        var menu = new E.Menu({
            editor: editor,  // 编辑器对象
            id: menuId,  // 菜单id
            title: '标题', // 菜单标题

            // 正常状态和选中状态下的dom对象，样式需要自定义
            $domNormal: $('<a href="#" tabindex="-1"><i class="wangeditor-menu-img-header"></i></a>'),
            $domSelected: $('<a href="#" tabindex="-1" class="selected"><i class="wangeditor-menu-img-header"></i></a>')
        });
        if ( editor.isRangeEmpty() ) {
            console.log('当前选区无选中内容');
        }


        // 菜单正常状态下，点击将触发该事件
        menu.clickEvent = function (e) {
            // 找到当前选区所在的 p 元素
            var elem = editor.getRangeElem();
            var p = editor.getSelfOrParentByName(elem, 'p');
            var ph2=editor.getRangeElem();
            var $ph2=$(ph2)
            var $p;

            if ($(ph2).hasClass("change")) {
                // 找到 h2元素，则忽略
                return menu.clickEventSelected();
            }
            $p = $(p);

            // 使用自定义命令
            function commandFn() {
                var pcontent=$p.text()
                $p.replaceWith("<h2 class='change'>"+pcontent+"</h2>")

            }
            editor.customCommand(e, commandFn);
        };

        // 菜单选中状态下，点击将触发该事件
        menu.clickEventSelected = function (e) {
            // 找到当前选区所在的 p 元素
            var elem = editor.getRangeElem();
            var p = editor.getSelfOrParentByName(elem, 'p');
            var ph2=editor.getRangeElem();
            var $ph2=$(ph2)
            var $p;


            if ($(ph2).hasClass("change")){
                // 找到 h2 元素，则忽略


            }

            var $ph3 = $($ph2);

            // 使用自定义命令
            function commandFn() {
                var pcontent=$ph3.text();
                $ph3.replaceWith("<p>"+pcontent+"</p>")

            }
            editor.customCommand(e, commandFn);
        };

        // 根据当前选区，自定义更新菜单的选中状态或者正常状态
        menu.updateSelectedEvent = function () {

            // 获取当前选区所在的父元素
            var elem = editor.getRangeElem();
            var p = editor.getSelfOrParentByName(elem, 'p');
            var ph2=editor.getRangeElem();
            var $ph2=$(ph2)
            var $p;
            var indent;

            if ($(ph2).hasClass("wangEditor-txt")) {
                // 未找到 p 元素，则标记为未处于选中状态
                
                return false;
            }
            $p = $(p);
            indent = $p.css('text-indent');

            if (!indent || indent === '0px') {
                // 得到的p，text-indent 属性是 0，则标记为未处于选中状态
                return false;
            }

            // 找到 p 元素，并且 text-indent 不是 0，则标记为选中状态
            return true;
        };

        // 增加到editor对象中
        editor.menus[menuId] = menu;
    });

})();