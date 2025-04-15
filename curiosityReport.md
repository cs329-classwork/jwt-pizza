# Docker Internals
> "Docker is just a Unix Process"
> 
> Buildings require foundation, framing, utility hookups and more.
> Turns out: Hardware/Software also requires those things.

The Internals consists of (but are definitely not limited to):
- **Kernel Namespaces**
- **Cgroups**
- **IPTables**

___
### Kernel Namespaces:
> Think of these like the boundaries between different areas of low level linux software. ie: network, storage, process management information, etc

What namespaces does Docker use?
- **PID** namespace
- **NET** namespace for network interfaces
- **IPC** namespace for access to IPC rss
	- inter-process communication
- **MNT** namespace to manage filesystem mount points
- **UTS** namespace for isolating kernel and version identifiers
	- Unix timesharing system
	- this separates the way that hostnames and NIS works on Linux
	- essential to create a more isolated and independent container environment

___
### Cgroups:
> A way to allocate/distribute system resources so that nothing gets starved/over-allocated

How are they used in container runtimes?
- enforce resource limits on containers
- prioritize resource usage
- monitor container performance in real time.

Each container on the system will have specific *Cgroup* rules that dictate how much CPU or memory the container can consume.

___
### IP Tables:
> Manages network isolation and networking between containers as well as between containers and the external network.

When Docker containers run, Docker will create a *virtual bridge network* on the host.
- This bridge network allows the container to not expose its private internal IP address to the external network.
- *IP Tables* are used to manage the bridge network

Example: Outward traffic into the system (targeting a container):
- Docker containers typically receive IP addresses that don't map to the external network.
- In this case, *IP Tables* manage the internal address and tell the system when to route traffic to the running Docker container (or any container)
- This is commonly referred to as *NAT* or Network Address Translation.

Another thing that *IP tables* are good for is *packet filtering*:
- You can control traffic with pretty strict rules, this also can be used for logging, etc.

___
