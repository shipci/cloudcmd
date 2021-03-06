var CloudCmd, Util, DOM;
(function(CloudCmd, Util, DOM) {
    'use strict';
    
    var Info    = DOM.CurrentInfo,
        Events  = DOM.Events,
        Chars   = [],
        KEY     = {
            BACKSPACE   : 8,
            TAB         : 9,
            ENTER       : 13,
            ESC         : 27,
            
            SPACE       : 32,
            PAGE_UP     : 33,
            PAGE_DOWN   : 34,
            END         : 35,
            HOME        : 36,
            UP          : 38,
            DOWN        : 40,
            
            INSERT      : 45,
            DELETE      : 46,
            
            ZERO        : 48,
            
            A           : 65,
            
            D           : 68,
            
            G           : 71,
            
            O           : 79,
            Q           : 81,
            R           : 82,
            S           : 83,
            T           : 84,
            
            Z           : 90,
            
            ASTERISK    : 106,
            PLUS        : 107,
            MINUS       : 109,
            
            F1          : 112,
            F2          : 113,
            F3          : 114,
            F4          : 115,
            F5          : 116,
            F6          : 117,
            F7          : 118,
            F8          : 119,
            F9          : 120,
            F10         : 121,
            
            SLASH       : 191,
            TRA         : 192, /* Typewritten Reverse Apostrophe (`) */
            BACKSLASH   : 220
        };
    
    KeyProto.prototype = KEY;
    CloudCmd.Key = KeyProto;
    
    function KeyProto() {
        var Key = this,
            Binded;
        
        this.isBind     = function() {
            return Binded;
        };
        
        this.setBind    = function() {
            Binded = true;
        };
        
        this.unsetBind  = function() {
            Binded = false;
        };
        
        this.bind   = function() {
            Events.addKey(listener);
            Binded = true;
        };
        
        function listener(event) {
            /* получаем выдленный файл*/
            var keyCode         = event.keyCode,
                alt             = event.altKey,
                ctrl            = event.ctrlKey;
            /* если клавиши можно обрабатывать*/
            if (Binded) {
                if (!alt && !ctrl && keyCode >= KEY.ZERO && keyCode <= KEY.Z)
                    setCurrentByLetter(keyCode);
                else {
                    Chars       = [];
                    switchKey(event);
                }
                
                /* устанавливаем все обработчики
                 * нажатий клавиш
                 */          
                } else if (keyCode === Key.S && alt) {
                /* обрабатываем нажатия на клавиши*/
                Binded = true;
                Util.log('<alt>+s pressed                           \n' +
                            '<ctrl>+r reload key-handerl - set      \n' +
                            '<ctrl>+s clear Storage key-handler - set \n' +
                            'press <alt>+q to remove them');
                
                Events.preventDefault(event);
            }
        }
        
        function setCurrentByLetter(pKeyCode) {
            var i, n, name, isMatch, byName, firstByName,
                skipCount   = 0,
                skipN       = 0,
                setted      = false,
                current     = Info.element,
                files       = Info.files,
                char        = String.fromCharCode(pKeyCode),
                regExp      = new RegExp('^' + char + '.*$', 'i');
                
            n               = Chars.length;
            for (i = 0; i < n; i++)
                if (char !== Chars[i])
                    break;
            
            if (!i)
                Chars = [];
            
            skipN           = skipCount = i;
            Chars.push(char);
            
            n               = files.length;
            for (i = 0; i < n; i++) {
                current     = files[i];
                name        = DOM.getCurrentName(current);
                isMatch     = name.match(regExp);
                
                if (isMatch) {
                    byName = DOM.getCurrentFileByName(name);
                    
                    if (!skipCount) {
                        setted = true;
                        DOM.setCurrentFile(byName);
                        break;
                    } else {
                        if (skipN === skipCount)
                            firstByName = byName;
                        
                        --skipCount;
                    }
                }
            }
            
            if (!setted) {
                DOM.setCurrentFile(firstByName);
                Chars = [char];
            }
        }
        
        function switchKey(event) {
            var i, obj, name, isSelected, isDir, prev, next,
                current         = Info.element,
                panel           = Info.panel,
                path            = Info.path,
                keyCode         = event.keyCode,
                shift           = event.shiftKey,
                lAlt            = event.altKey,
                ctrl            = event.ctrlKey;
            
            if (current) {
                prev            = current.previousSibling;
                next            = current.nextSibling;
            }
            
            switch (keyCode) {
            case Key.TAB:
                DOM.changePanel();
                Events.preventDefault(event);
                break;
            
            case Key.INSERT:
                DOM .toggleSelectedFile(current)
                    .setCurrentFile(next);
                break;
            
            case Key.DELETE:
                if (shift)
                    DOM.sendDelete();
                else
                    DOM.promptDelete(current);
                break;
            
            case Key.ASTERISK:
                DOM.toggleAllSelectedFiles(current);
                break;
            
            case Key.PLUS:
                DOM.expandSelection();
                break;
            
            case Key.MINUS:
                DOM.shrinkSelection();
                break;
            
            case Key.F1:
                CloudCmd.Help.show();
                Events.preventDefault(event);
                break;
            
            case Key.F2:
                DOM.renameCurrent(current);
                break;
                
            case Key.F3:
                if (shift)
                    CloudCmd.Markdown.show(path);
                else
                    CloudCmd.View.show();
                
                Events.preventDefault(event);
                break;
            
            case Key.F4:
                CloudCmd.Edit.show();
                Events.preventDefault(event);
                break;
            
            case Key.F5:
                DOM.copyFiles();
                Events.preventDefault(event);
                break;
            
            case Key.F6:
                DOM.moveFiles();
                Events.preventDefault(event);
                break;
            
            case Key.F7:
                if (shift)
                    DOM.promptNewFile();
                else
                    DOM.promptNewDir();
                
                Events.preventDefault(event);
                break;
            
            case Key.F8:
                DOM.promptDelete(current);
                break;
            
            case Key.F9:
                CloudCmd.Menu.show();
                Events.preventDefault(event);
                
                break;
            
            case Key.F10:
                CloudCmd.Config.show();
                Events.preventDefault(event);
                
                break;
            
            case Key.TRA:
                DOM.Images.showLoad({top: true});
                
                if (shift)
                    obj = CloudCmd.Terminal;
                else
                    obj = CloudCmd.Console;
                
                obj.show();
                Events.preventDefault(event);
                
                break;
                
            case Key.SPACE:
                isDir   = Info.isDir,
                name    = Info.name;
                
                if (!isDir || name === '..')
                    isSelected    = true;
                else
                    isSelected    = DOM.isSelected(current);
                    
                Util.exec.if(isSelected, function() {
                    DOM.toggleSelectedFile(current);
                }, function(callback) {
                    DOM.loadCurrentSize(callback, current);
                });
                
                Events.preventDefault(event);
                break;
            
            /* навигация по таблице файлов  *
             * если нажали клавишу вверх    *
             * выделяем предыдущую строку   */
            case Key.UP:
                if (shift)
                     DOM.toggleSelectedFile(current);
                
                DOM.setCurrentFile(prev);
                Events.preventDefault(event);
                break;
            
            /* если нажали клавишу в низ - выделяем следующую строку    */
            case Key.DOWN:
                if (shift)
                     DOM.toggleSelectedFile(current);
                
                DOM.setCurrentFile(next);
                Events.preventDefault(event);
                break;
            
            /* если нажали клавишу Home     *
             * переходим к самому верхнему  *
             * элементу                     */
            case Key.HOME:
                DOM.setCurrentFile(Info.first);
                Events.preventDefault(event);
                break;
            
            /* если нажали клавишу End выделяем последний элемент   */
            case Key.END:
                DOM.setCurrentFile(Info.last);
                Events.preventDefault(event);
                break;
            
            /* если нажали клавишу page down проматываем экран */
            case Key.PAGE_DOWN:
                DOM.scrollByPages(panel, 1);
                
                for (i = 0; i < 30; i++) {
                    
                    if (!current.nextSibling)
                        break;
                    
                    current = current.nextSibling;
                }
                DOM.setCurrentFile(current);
                Events.preventDefault(event);
                break;
            
            /* если нажали клавишу page up проматываем экран */
            case Key.PAGE_UP:
                DOM.scrollByPages(panel, -1);
                
                var tryCatch    = function(pCurrentFile) {
                        Util.exec.try(function() {
                            return pCurrentFile
                                    .previousSibling
                                        .previousSibling
                                            .previousSibling
                                                .previousSibling;
                        });
                    };
                
                for (i = 0; i < 30; i++) {
                    if (!current.previousSibling || tryCatch(current) )
                        break;
                    
                    current = current.previousSibling;
                }
                
                DOM.setCurrentFile(current);
                Events.preventDefault(event);
                break;
                
            /* открываем папку*/
            case Key.ENTER:
                if (Info.isDir)
                    CloudCmd.loadDir({
                        path: DOM.getCurrentPath()
                    });
                break;
                
            case Key.BACKSPACE:
                CloudCmd.goToParentDir();
                Events.preventDefault(event);
                break;
            
            case Key.BACKSLASH:
                if (ctrl)
                    CloudCmd.loadDir({
                        path: '/'
                    });
                break;
            
            case Key.A:
                if (ctrl)
                    DOM.toggleAllSelectedFiles();
                    Events.preventDefault(event);
                
                break;
            
            /* 
             * обновляем страницу,
             * загружаем содержимое каталога
             * при этом данные берём всегда с
             * сервера, а не из кэша
             * (обновляем кэш)
             */
            case Key.R:
                if (ctrl) {
                    Util.log('<ctrl>+r pressed\n' +
                            'reloading page...\n' +
                            'press <alt>+q to remove all key-handlers');
                    
                    CloudCmd.refresh();
                    Events.preventDefault(event);
                }
                break;
            
            /* чистим хранилище */
            case Key.D:
                if (ctrl) {
                    Util.log('<ctrl>+d pressed\n'  +
                        'clearing Storage...\n' +
                        'press <alt>+q to remove all key-handlers');
                    
                    DOM.Storage.clear();
                    Events.preventDefault();
                }
                break;
            
            /* убираем все обработчики нажатий клавиш */
            case Key.Q:
                if (lAlt) {
                    Util.log('<alt>+q pressed\n'                         +
                                '<ctrl>+r reload key-handerl - removed'     +
                                '<ctrl>+s clear Storage key-handler - removed'+
                                'press <alt>+s to to set them');
                    
                    Binded = false;
                    Events.preventDefault(event);
                }
                break;
            }
        }
    }

})(CloudCmd, Util, DOM);
