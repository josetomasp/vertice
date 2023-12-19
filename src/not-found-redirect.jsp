<%@ page import="java.io.*" contentType="text/html"%>
<% if(request.getAttribute("javax.servlet.forward.request_uri").toString().startsWith("/vertice-ui/lomn")){ %>
<%@include file="./lomn/index.html" %>
<% } else { %>
<%@include file="./vertice/index.html" %>
<% } %>
