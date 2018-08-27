//log日志开关
window.CONSOLE_LOG_OPEN = true;

//optionBlank://
window.OPTION_BLANK = true;

//脏矩形优化
if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
	cc.renderer.enableDirtyRegion(true);
}

//帧率
// cc.game.setFrameRate(30);

//设置是否在左下角显示 FPS
// cc.director.setDisplayStats(false);

//注册监听home键事件
document.addEventListener('resignActivePauseGame', function () {
	cc.director.pause();
	cc.game.pause();

	console.log('app just resign active.');
});
document.addEventListener('becomeActiveResumeGame', function () {
	if (cc.game.isPaused) {
		cc.game.resume();
	}
	if (cc.director.isPaused) {
		cc.director.resume();
	}
	console.log('app just become active.');
});