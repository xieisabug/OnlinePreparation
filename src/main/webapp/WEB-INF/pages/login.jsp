<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>登陆</title>
    <link href="lib/semanic/css/semantic.min.css" rel="stylesheet">
</head>
<body style="background:#1abc9c;">
    <p>${message}</p>

        <%--<label>账号：--%>
            <%--<input type="text" name="username"/>--%>
        <%--</label>--%>
        <%--<label>密码：--%>
            <%--<input type="password" name="password">--%>
        <%--</label>--%>
        <%--<input type="submit" value="登陆"/>--%>
        <div class="ui two column middle aligned relaxed grid basic segment" style="margin: 140px auto 0;">
            <div class="column">
                <div class="ui form segment">
                    <form action="login" method="post">
                        <div class="field">
                            <label>账号：</label>
                            <div class="ui left labeled icon input">
                                <input type="text" name="username" placeholder="请输入您的用户名">
                                <i class="user icon"></i>
                                <div class="ui corner label">
                                    <i class="asterisk icon"></i>
                                </div>
                            </div>
                        </div>
                        <div class="field">
                            <label for="password">密码：</label>
                            <div class="ui left labeled icon input">
                                <input type="password" name="password" id="password" placeholder="请输入密码">
                                <i class="lock icon"></i>
                                <div class="ui corner label">
                                    <i class="asterisk icon"></i>
                                </div>
                            </div>
                        </div>
                        <%--<div class="ui blue submit button">登陆</div>--%>
                        <input type="submit" class="ui blue submit button" value="登陆" />
                    </form>
                </div>
            </div>
        </div>
</body>
<script type="text/javascript" src="lib/semanic/javascript/semantic.min.js"></script>
</html>