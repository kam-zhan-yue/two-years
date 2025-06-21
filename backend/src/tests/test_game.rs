#[cfg(test)]
mod tests {
    use futures_util::{SinkExt, StreamExt};
    use std::{
        future::IntoFuture,
        net::{Ipv4Addr, SocketAddr},
    };
    use tokio_tungstenite::tungstenite;

    use crate::app;

    #[tokio::test]
    async fn integration_test() {
        println!("Tokio test");
        let listener = tokio::net::TcpListener::bind(SocketAddr::from((Ipv4Addr::UNSPECIFIED, 0)))
            .await
            .unwrap();

        let addr = listener.local_addr().unwrap();
        tokio::spawn(axum::serve(listener, app()).into_future());

        let (mut socket, _response) =
            tokio_tungstenite::connect_async(format!("ws://{addr}/integration-testable"))
                .await
                .unwrap();

        socket
            .send(tungstenite::Message::text("foo"))
            .await
            .unwrap();

        let msg = match socket.next().await.unwrap().unwrap() {
            tungstenite::Message::Text(msg) => msg,
            other => panic!("expected a text message but got {other:?}"),
        };

        assert_eq!(msg.as_str(), "You said: foo");
    }
}
