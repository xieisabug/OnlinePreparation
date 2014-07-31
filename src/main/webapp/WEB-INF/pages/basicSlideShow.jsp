<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
    <title>${file.name}</title>
    <style type="text/css">
        body {
            background: radial-gradient(#F0F0F0, #BEBEBE) repeat scroll 0% 0% transparent;
        }
        .slide {
            /*display: block;*/

            width: 800px;
            height: 500px;
            padding: 40px 60px;

            background-color: white;
            border: 1px solid rgba(0, 0, 0, .3);
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, .1);

            color: rgb(102, 102, 102);
            text-shadow: 0 2px 2px rgba(0, 0, 0, .1);

            font-family: 'Open Sans', Arial, sans-serif;
            overflow: hidden;
            /*font-size: 30px;*/
            /*line-height: 36px;*/
            /*letter-spacing: -1px;*/
        }
    </style>
</head>
<body>
<div id="impress">
<c:forEach items="${slide.parts}" var="part" varStatus="status">
    <div class="step slide" id="step${status.index}" data-x="${status.index * 1300}" data-y="0">${part.content}</div>
</c:forEach>
    <div id="overview" class="step" data-x="1000" data-y="-600" data-scale="3" style="font-size: 60px; width: 300px;">
        <span>谢谢观赏！</span>
    </div>
</div>
</body>
<script type="text/javascript" src="<%=basePath%>lib/impress.js"></script>
<script type="text/javascript">
    impress().init();
</script>
</html>
