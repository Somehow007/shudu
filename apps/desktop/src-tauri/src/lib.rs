use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, WindowEvent,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let _ = app.set_activation_policy(tauri::ActivationPolicy::Regular);
            
            setup_tray(app)?;
            setup_menu(app)?;
            
            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                #[cfg(target_os = "macos")]
                {
                    window.hide().unwrap();
                    api.prevent_close();
                }
                #[cfg(not(target_os = "macos"))]
                {
                    let _ = window;
                    let _ = api;
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup_tray(app: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    let show_i = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
    let hide_i = MenuItem::with_id(app, "hide", "隐藏窗口", true, None::<&str>)?;
    let quit_i = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    
    let menu = Menu::with_items(app, &[&show_i, &hide_i, &quit_i])?;
    
    let _tray = TrayIconBuilder::new()
        .menu(&menu)
        .menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "hide" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.hide();
                }
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app)?;
    
    Ok(())
}

fn setup_menu(app: &tauri::AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(target_os = "macos")]
    {
        use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};
        
        let about = MenuItemBuilder::with_id("about", "关于益智游戏合集").build(app)?;
        let preferences = MenuItemBuilder::with_id("preferences", "偏好设置...").build(app)?;
        let hide = MenuItemBuilder::with_id("hide", "隐藏益智游戏合集").accelerator("CmdOrCtrl+H").build(app)?;
        let hide_others = MenuItemBuilder::with_id("hide_others", "隐藏其他").accelerator("CmdOrCtrl+Alt+H").build(app)?;
        let show_all = MenuItemBuilder::with_id("show_all", "显示全部").build(app)?;
        let quit = MenuItemBuilder::with_id("quit", "退出益智游戏合集").accelerator("CmdOrCtrl+Q").build(app)?;
        
        let app_menu = SubmenuBuilder::new(app, "益智游戏合集")
            .item(&about)
            .separator()
            .item(&preferences)
            .separator()
            .item(&hide)
            .item(&hide_others)
            .item(&show_all)
            .separator()
            .item(&quit)
            .build()?;
        
        let new_game = MenuItemBuilder::with_id("new_game", "新游戏").accelerator("CmdOrCtrl+N").build(app)?;
        let undo = MenuItemBuilder::with_id("undo", "撤销").accelerator("CmdOrCtrl+Z").build(app)?;
        let redo = MenuItemBuilder::with_id("redo", "重做").accelerator("CmdOrCtrl+Shift+Z").build(app)?;
        
        let edit_menu = SubmenuBuilder::new(app, "编辑")
            .item(&new_game)
            .separator()
            .item(&undo)
            .item(&redo)
            .build()?;
        
        let file_menu = SubmenuBuilder::new(app, "文件")
            .item(&new_game)
            .build()?;
        
        let menu = MenuBuilder::new(app)
            .item(&app_menu)
            .item(&file_menu)
            .item(&edit_menu)
            .build()?;
        
        app.set_menu(&menu)?;
        
        app.on_menu_event(move |app, event| {
            match event.id.as_ref() {
                "about" => {
                    // Show about dialog
                }
                "preferences" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("navigate", "settings");
                    }
                }
                "quit" => {
                    app.exit(0);
                }
                "new_game" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("menu_action", "new_game");
                    }
                }
                "undo" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("menu_action", "undo");
                    }
                }
                "redo" => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.emit("menu_action", "redo");
                    }
                }
                _ => {}
            }
        });
    }
    
    Ok(())
}
