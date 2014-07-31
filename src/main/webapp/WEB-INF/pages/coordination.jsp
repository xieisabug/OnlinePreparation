<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
    <title>文件编辑</title>
    <link href="<%=basePath%>lib/semanic/css/semantic.min.css" rel="stylesheet">
    <link href="<%=basePath%>ueditor/themes/default/css/ueditor.css" rel="stylesheet">
    <link href="<%=basePath%>css/coordination.css" rel="stylesheet">
</head>
<body>
    <div class="ui active inverted dimmer" id="loader">
        <div class="ui text loader">连接服务器中，请等待...</div>
    </div>
    <div class="left">
        <div id="editor">
            <textarea name="ueditor" id="ueditor"></textarea>
        </div>
        <div id="info">
            <span>${user.name}</span>
            <button id="generateWord" class="ui icon button" onclick="generateWord()"><i class="cloud download icon"></i></button>
        </div>
    </div>
    <div class="right">
        <div id="chat">
            <div class="field">
                <textarea id="chat_content" onchange="" disabled></textarea>
            </div>

            <div class="ui action input">
                <input type="text" id="chat_input">
                <div class="ui secondary button" onclick="sendName()" id="send_button">发送</div>
            </div>
        </div>
    </div>
</body>
<script type="text/javascript">
    var id = ${user.id};
    var username = "${user.username}";
    var name = "${user.name}";
    var spaceId = ${spaceId};
    var fileId = ${fileId};
    var coordinationId = ${coordination.id};
</script>
<script type="text/javascript" src="<%=basePath%>lib/sockjs-0.3.4.min.js"></script>
<script type="text/javascript" src="<%=basePath%>lib/debug/rangy-core.js"></script>
<script type="text/javascript" src="<%=basePath%>lib/debug/rangy-selectionsaverestore.js"></script>
<script type="text/javascript" src="<%=basePath%>lib/stomp.js"></script>
<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.js"></script>
<script type="text/javascript" src="<%=basePath%>lib/semanic/javascript/semantic.min.js"></script>
<script type="text/javascript" src="<%=basePath%>ueditor/ueditor.config.document.js"></script>
<script type="text/javascript" src="<%=basePath%>ueditor/ueditor.all.js"></script>
<script type="text/javascript" src="<%=basePath%>lib/debug/diff_match_patch_uncompressed.js"></script>
<script type="text/javascript" src="<%=basePath%>js/coordination.js"></script>
</html>
