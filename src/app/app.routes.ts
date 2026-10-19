import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginGuard } from './services/login.guard';

export const routes: Routes = [
{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path:'build-version',
    loadComponent: () => import('./components/layout/version/version.component').then( m => m.VersionComponent),
  },
  
  // { path: 'super', loadChildren: () => import('./pages/super-parent/super-parent.page').then(m => m.SuperParentPage),  },
  // canActivate:[AuthGuard]
  // {
  //   path: 'alert-msg-boxes',
  //   loadChildren: () => import('./pages/alert-msg-boxes/alert-msg-boxes.page').then( m => m.AlertMsgBoxesPage)
  // },
  // {
  //   path: 'apex-action-filter',
  //   loadChildren: () => import('./pages/apex-action-filter/apex-action-filter.page').then( m => m.ApexActionFilterPage)
  // },

  // {
  //   path: 'usersetting',
  //   loadChildren: () => import('./pages/usersetting_old/usersetting.page').then( m => m.UsersettingPage)
  // },

  // {
  //   path: 'appkey-info',
  //   loadChildren: () => import('./pages/appkey-info/appkey-info.page').then( m => m.AppkeyInfoPage)
  // },
  // {
  //   path: 'appkey-user-info',
  //   loadChildren: () => import('./pages/appkey-user-info/appkey-user-info.page').then( m => m.AppkeyUserInfoPage)
  // },
 
  {
    path: 'appkey-validation',
    loadComponent: () => import('./pages/appkey-validation-new/appkey-validation-new.page').then( m => m.AppkeyValidationNewPage),
    canActivate:[LoginGuard]

  },

  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
    canActivate:[LoginGuard]
  },
  {
    path: 'super',
    loadComponent: () => import('./pages/super-parent/super-parent.page').then( m => m.SuperParentPage),
    canActivate:[AuthGuard]
  },
  {
    path: 'usersetting',
    loadComponent: () => import('./pages/usersetting/usersetting.page').then( m => m.UsersettingPage)
  },
  {
    path: 'SSONEW/:token',
    loadComponent: () => import('./pages/sso/sso.page').then( m => m.SsoPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
{
    path: 'appkey-collection',
    loadComponent: () => import('./pages/appkey-collection/appkey-collection.page').then( m => m.AppkeyCollectionPage),canActivate:[LoginGuard]
  },
    {
    path: 'change-password',
    loadComponent: () => import('./pages/change-password/change-password.page').then( m => m.ChangePasswordPage)
  },
   {
    path: 'login-with-otp',
    loadComponent: () => import('./pages/login-with-otp/login-with-otp.page').then( m => m.LoginWithOtpPage)
  },
  //   {
  //   path: 'forgot-password',
  //   loadChildren: () => import('./pages/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  // },

  
  // {
  //   path: 'beta-version',
  //   loadChildren: () => import('./pages/beta-version/beta-version.page').then( m => m.BetaVersionPage)
  // },

  // {
  //   path: 'change-server-setting',
  //   loadChildren: () => import('./pages/change-server-setting/change-server-setting.page').then( m => m.ChangeServerSettingPage)
  // },
  // {
  //   path: 'dev-click-events',
  //   loadChildren: () => import('./pages/dev-click-events/dev-click-events.page').then( m => m.DevClickEventsPage)
  // },
  // {
  //   path: 'dev-frame-item-list',
  //   loadChildren: () => import('./pages/dev-frame-item-list/dev-frame-item-list.page').then( m => m.DevFrameItemListPage)
  // },
  // {
  //   path: 'dev-frame-mast-editor',
  //   loadChildren: () => import('./pages/dev-frame-mast-editor/dev-frame-mast-editor.page').then( m => m.DevFrameMastEditorPage)
  // },
  // {
  //   path: 'dev-image-icon-mast-editor',
  //   loadChildren: () => import('./pages/dev-image-icon-mast-editor/dev-image-icon-mast-editor.page').then( m => m.DevImageIconMastEditorPage)
  // },
  // {
  //   path: 'dev-obj-frame-list',
  //   loadChildren: () => import('./pages/dev-obj-frame-list/dev-obj-frame-list.page').then( m => m.DevObjFrameListPage)
  // },
  // {
  //   path: 'dev-object-mast-editor',
  //   loadChildren: () => import('./pages/dev-object-mast-editor/dev-object-mast-editor.page').then( m => m.DevObjectMastEditorPage)
  // },

  // {
  //   path: 'dynamicmodal',
  //   loadChildren: () => import('./pages/dynamicmodal/dynamicmodal.page').then( m => m.DynamicmodalPage)
  // },
  // {
  //   path: 'entry-list',
  //   loadChildren: () => import('./pages/entry-list/entry-list.page').then( m => m.EntryListPage)
  // },
  // {
  //   path: 'execute-query',
  //   loadChildren: () => import('./pages/execute-query/execute-query.page').then( m => m.ExecuteQueryPage)
  // },
  // {
  //   path: 'executed-tab',
  //   loadChildren: () => import('./pages/executed-tab/executed-tab.page').then( m => m.ExecutedTabPage)
  // },

  // {
  //   path: 'freezecolumn',
  //   loadChildren: () => import('./pages/freezecolumn/freezecolumn.page').then( m => m.FreezecolumnPage)
  // },
  // {
  //   path: 'image-icon-master',
  //   loadChildren: () => import('./pages/image-icon-master/image-icon-master.page').then( m => m.ImageIconMasterPage)
  // },
  // {
  //   path: 'image-preview',
  //   loadChildren: () => import('./pages/image-preview/image-preview.page').then( m => m.ImagePreviewPage)
  // },


  // {
  //   path: 'look-and-feel',
  //   loadChildren: () => import('./pages/look-and-feel/look-and-feel.page').then( m => m.LookAndFeelPage)
  // },

  // {
  //   path: 'multi-alert-notification',
  //   loadChildren: () => import('./pages/multi-alert-notification/multi-alert-notification.page').then( m => m.MultiAlertNotificationPage)
  // },
  // {
  //   path: 'multi-level-tab',
  //   loadChildren: () => import('./pages/multi-level-tab/multi-level-tab.page').then( m => m.MultiLevelTabPage)
  // },
  // {
  //   path: 'offline-entry-list',
  //   loadChildren: () => import('./pages/offline-entry-list/offline-entry-list.page').then( m => m.OfflineEntryListPage)
  // },
  // {
  //   path: 'offline-entry-tabs',
  //   loadChildren: () => import('./pages/offline-entry-tabs/offline-entry-tabs.page').then( m => m.OfflineEntryTabsPage)
  // },
  // {
  //   path: 'parent-menu',
  //   loadChildren: () => import('./pages/parent-menu/parent-menu.page').then( m => m.ParentMenuPage)
  // },
  // {
  //   path: 'partylist',
  //   loadChildren: () => import('./pages/partylist/partylist.page').then( m => m.PartylistPage)
  // },
  // {
  //   path: 'pending-tab',
  //   loadChildren: () => import('./pages/pending-tab/pending-tab.page').then( m => m.PendingTabPage)
  // },
  // {
  //   path: 'popover',
  //   loadChildren: () => import('./pages/popover/popover.page').then( m => m.PopoverPage)
  // },
  // {
  //   path: 'reset-password',
  //   loadChildren: () => import('./pages/reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  // },
  // {
  //   path: 'setting',
  //   loadChildren: () => import('./pages/setting/setting.page').then( m => m.SettingPage)
  // },
  // {
  //   path: 'single-select-lov',
  //   loadChildren: () => import('./pages/single-select-lov/single-select-lov.page').then( m => m.SingleSelectLovPage)
  // },
  // {
  //   path: 'sql-light-tran',
  //   loadChildren: () => import('./pages/sql-light-tran/sql-light-tran.page').then( m => m.SqlLightTranPage)
  // },
  // {
  //   path: 'text-area',
  //   loadChildren: () => import('./pages/text-area/text-area.page').then( m => m.TextAreaPage)
  // },
  // {
  //   path: 'tree-callpage',
  //   loadChildren: () => import('./pages/tree-callpage/tree-callpage.page').then( m => m.TreeCallpagePage)
  // },
  // {
  //   path: 'update-app',
  //   loadChildren: () => import('./pages/update-app/update-app.page').then( m => m.UpdateAppPage)
  // },
  // {
  //   path: 'apex-highlight',
  //   loadChildren: () => import('./pages/apex-highlight/apex-highlight.page').then( m => m.ApexHighlightPage)
  // },

  // {
  //   path: 'home',
  //   loadChildren: () => import('./pages/home/home.page').then( m => m.HomePage)
  // },
  // {
  //   path: 'modal',
  //   loadChildren: () => import('./pages/modal/modal.page').then( m => m.ModalPage)
  // },
  // {
  //   path: 'developer-mode',
  //   loadChildren: () => import('./pages/developer-mode/developer-mode.page').then( m => m.DeveloperModePage)
  // },
  // {
  //   path: 'msg-box',
  //   loadChildren: () => import('./pages/msg-box/msg-box.page').then( m => m.MsgBoxPage)
  // },
  // {
  //   path: 'json-listing',
  //   loadChildren: () => import('./pages/json-listing/json-listing.page').then( m => m.JsonListingPage)
  // },
  // {
  //   path: 'new-alert-msg-boxes',
  //   loadChildren: () => import('./pages/new-alert-msg-boxes/new-alert-msg-boxes.page').then( m => m.NewAlertMsgBoxesPage)
  // },
  // {
  //   path: 'date-popup',
  //   loadChildren: () => import('./pages/date-popup/date-popup.page').then( m => m.DatePopupPage)
  // },
  // {
  //   path: 'single-select-lov-ref',
  //   loadChildren: () => import('./pages/single-select-lov-ref/single-select-lov-ref.page').then( m => m.SingleSelectLovRefPage)
  // },
 
  // {
  //   path: 'ws-log',
  //   loadChildren: () => import('./pages/ws-log/ws-log.page').then( m => m.WsLogPage)
  // },
  // {
  //   path: 'sso/:name',
  //   loadChildren: () => import('./pages/direct-login/direct-login.page').then( m => m.DirectLoginPage)
  // },


];
