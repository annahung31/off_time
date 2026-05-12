import webview
import os
import sys


def resource(filename):
    """Get absolute path — works both in dev and PyInstaller bundle."""
    if hasattr(sys, '_MEIPASS'):
        return os.path.join(sys._MEIPASS, filename)
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)


if __name__ == '__main__':
    html = resource('index.html')
    url = 'file:///' + html.replace('\\', '/')

    window = webview.create_window(
        title='下班倒數',
        url=url,
        width=400,
        height=560,
        resizable=True,
        on_top=False,
        frameless=False,
        min_size=(320, 440),
    )
    webview.start(gui='edgechromium')   # Windows 11 built-in WebView2
