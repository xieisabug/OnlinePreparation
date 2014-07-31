<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
    <title>在线备课系统--${user.name}</title>
    <link href="<%=basePath%>lib/semanic/css/semantic.min.css" rel="stylesheet">
</head>
<body style="margin: 0; font-family: '微软雅黑','宋体',monospace;">
    <div class="ui vertically grid">
        <div class="row" style="background: #009A93; color:white; padding:20px 0;">
            <div class="ten wide column">
                <img class="ui avatar image" style="width:60px; height:60px;"
                     src="<%=basePath%>image/logo.jpg">
                ${user.name} 欢迎登陆
            </div>
            <div class="six wide column">
                备课空间<br>
                名称:${space.spaceName}<br>
                创建时间:${space.createDate}
            </div>
        </div>
        <div class="row" style="margin: 0; padding:0;">
            <div class="three wide column" style="padding-top: 20px;">
                <%--备课空间切换选择列表--%>
                <div class="blue ui fluid vertical small buttons">
                    <c:forEach items="${spaceList}" var="spaceItem">
                        <div class="ui button" id="space${spaceItem.id}" onclick="spaceJump(${spaceItem.id})">
                            ${spaceItem.spaceName}
                        </div>
                    </c:forEach>
                </div>
            </div>
            <div class="ten wide column" style="height:500px; overflow-y: scroll; background:#f0f0f0;">
                <div></div>
                <div class="ui menu">
                    <div class="item">
                        <div class="ui teal button" id="createDocument">创建文档</div>
                    </div>
                    <div class="item">
                        <div class="ui teal button" id="createSlide">创建演示文稿</div>
                    </div>
                </div>
                <div class="ui six items" id="fileContent">
                    <c:forEach items="${fileList}" var="fileItem">
                        <div class="item" onclick="open${fileItem.type}(${space.id},${fileItem.id})" style="min-height: 0;">
                            <div>
                                <img src="<%=basePath%>image/file_icon_${fileItem.type}.png" style="width: 115px; height:125px;">
                            </div>
                            <div class="content">
                                <div style="overflow: hidden;height:20px;">${fileItem.name}</div>
                            </div>
                        </div>
                    </c:forEach>
                </div>
            </div>
            <div class="three wide column" style="height:500px; overflow-y: scroll;">
                <div></div>
                <div class="ui menu">
                    <div class="item">
                        <div class="ui teal button" id="addFriend">添加成员</div>
                    </div>
                </div>
                <div class="ui selection list">
                    <c:forEach var="friend" items="${friendList}">
                        <div class="item" style="font-size: 15px;" id="spaceFriend${friend.id}">
                            <img class="ui avatar image" src="<%=basePath%>image/people.jpg">
                            <div class="content">
                                <div class="header">${friend.name}</div>
                            </div>
                            <div class="right floated tiny red ui button" onclick="removeFriend(${friend.id})">
                                <i class="icon remove"></i>
                            </div>
                        </div>
                    </c:forEach>
                </div>
            </div>
        </div>
    </div>


    <%--添加空间好友的对话框--%>
    <div class="ui addFriend modal transition scrolling hidden" style="margin-top: 1em; top: 0;">
        <i class="close icon"></i>
        <div class="header">
            添加成员
        </div>
        <div class="content">
            <div class="center">
                <div class="ui header">请输入您要添加的成员的信息：</div>
                <label for="searchName">姓名</label>
                <div class="ui left labeled input">
                    <input type="text" id="searchName" name="searchName">
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui black button">
                取消
            </div>
            <div class="ui positive right labeled icon button" onclick="searchFriends();">
                搜索
                <i class="search icon"></i>
            </div>
        </div>
    </div>
    <%--创建文档的对话框--%>
    <div class="ui createDocument modal transition scrolling hidden" style="margin-top: 1em; top: 0;">
        <i class="close icon"></i>
        <div class="header">
            创建文档
        </div>
        <div class="content">
            <div class="center">
                <div class="ui header">请输入创建文档的名称：</div>
                <label for="documentName">名称：</label>
                <div class="ui left labeled input">
                    <input type="text" id="documentName" name="documentName">
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui black button">
                取消
            </div>
            <div class="ui positive right labeled icon button" onclick="createDoc();">
                创建
                <i class="checkmark icon"></i>
            </div>
        </div>
    </div>
    <%--创建文档的对话框--%>
    <div class="ui createSlide modal transition scrolling hidden" style="margin-top: 1em; top: 0;">
        <i class="close icon"></i>
        <div class="header">
            创建演示文稿
        </div>
        <div class="content">
            <div class="center">
                <div class="ui header">请输入创建演示文稿的名称：</div>
                <label for="slideName">名称：</label>
                <div class="ui left labeled input">
                    <input type="text" id="slideName" name="slideName">
                </div>
            </div>
        </div>
        <div class="actions">
            <div class="ui black button">
                取消
            </div>
            <div class="ui positive right labeled icon button" onclick="createSlide();">
                创建
                <i class="checkmark icon"></i>
            </div>
        </div>
    </div>
    <%--搜索到的用户的列表--%>
    <div class="ui friendList modal transition scrolling hidden" style="margin-top: 1em; top: 0;">
        <i class="close icon"></i>
        <div class="header">
            添加用戶
        </div>
        <div class="content">
            <div class="center ui six items" id="friendList" style="height:350px; overflow-y: scroll;">
            </div>
        </div>
        <div class="actions">
            <div class="ui black button">
                关闭
            </div>
        </div>
    </div>

</body>
<script type="text/javascript">
    var userId = ${user.id};
    var spaceId = ${space.id};
    var basePath = '<%=basePath%>';
</script>
<script type="text/javascript" src="http://code.jquery.com/jquery-1.11.0.js"></script>
<script type="text/javascript" src="<%=basePath%>lib/semanic/javascript/semantic.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/home.js"></script>
</html>
